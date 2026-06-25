"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import RightPanel from "@/components/RightPanel";
import commentService from "@/core/services/comment.service";
import meService from "@/core/services/me.service";
import { formatRelativeTime } from "@/utils/timeFormat";

const MAX_REPLY_CHAR = 280;

export default function CommentThreadPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user: authUser, logout } = useAuth();

  const [comment, setComment] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loadingComment, setLoadingComment] = useState(true);
  const [loadingReplies, setLoadingReplies] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchComment = async () => {
      try {
        setLoadingComment(true);
        const result = await commentService.getById(id);
        setComment(result?.data || result);
      } catch {
        setError("Commentaire introuvable");
      } finally {
        setLoadingComment(false);
      }
    };

    const fetchReplies = async () => {
      try {
        setLoadingReplies(true);
        const result = await commentService.getReplies(id);
        setReplies(result?.data || result || []);
      } catch {
        setReplies([]);
      } finally {
        setLoadingReplies(false);
      }
    };

    fetchComment();
    fetchReplies();
  }, [id]);

  const handleSubmitReply = async () => {
    if (!replyText.trim() || submitting || !id) return;

    setSubmitting(true);
    try {
      const result = await commentService.createReply(id, {
        content: replyText.trim(),
      });
      const newReply = result?.data || result;
      setReplies((prev) => [newReply, ...prev]);
      setReplyText("");
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/signin");
  };

  const sidebarUser = {
    name: authUser?.username || "Utilisateur",
    tag: authUser?.username?.toLowerCase().replace(/\s+/g, "_") || "user",
    profile: authUser?.avatar ? authUser?.avatar : "https://i.pravatar.cc/100?img=12",
    userId: authUser?.user_id,
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar user={sidebarUser} onLogout={handleLogout} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto py-6 px-4">

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </button>
              <h1 className="text-xl font-bold">Réponses</h1>
            </div>

            {/* Commentaire parent affiché comme un post */}
            {loadingComment ? (
              <div className="bg-white border border-gray-100 rounded-xl p-6 text-center">
                <p className="text-gray-400">Chargement...</p>
              </div>
            ) : error || !comment ? (
              <div className="bg-white border border-gray-100 rounded-xl p-6 text-center">
                <p className="text-red-400">{error || "Commentaire introuvable"}</p>
              </div>
            ) : (
              <CommentAsPost
                comment={comment}
                onPostClick={() =>
                  comment.post_id && router.push(`/post/${comment.post_id}`)
                }
                onProfileClick={() =>
                  comment.user_id && router.push(`/profile/${comment.user_id}`)
                }
              />
            )}

            {/* Zone de réponse */}
            {!loadingComment && !error && comment && (
              <div className="mt-4 bg-white border border-gray-100 rounded-xl p-4 flex gap-3 items-start">
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600 flex-shrink-0">
                  {authUser?.username?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="flex-1">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Répondre à ce commentaire..."
                    rows={2}
                    maxLength={MAX_REPLY_CHAR}
                    className="w-full resize-none text-sm text-gray-700 placeholder-gray-400 border-none outline-none bg-transparent"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                        handleSubmitReply();
                      }
                    }}
                  />
                  <div className="flex justify-between mt-1 text-xs text-gray-400">
                    <span />
                    <span>{replyText.length} / {MAX_REPLY_CHAR}</span>
                  </div>
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleSubmitReply}
                      disabled={!replyText.trim() || submitting}
                      className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
                    >
                      <Send size={13} />
                      {submitting ? "Envoi..." : "Répondre"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Liste des réponses */}
            <div className="mt-4 space-y-3">
              {loadingReplies ? (
                <p className="text-center text-gray-400 text-sm py-4">
                  Chargement des réponses...
                </p>
              ) : replies.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-4">
                  Aucune réponse pour le moment
                </p>
              ) : (
                replies.map((reply) => (
                  <ReplyCard
                    key={reply.comment_id || reply.id}
                    reply={reply}
                  />
                ))
              )}
            </div>

          </div>
        </main>

        <RightPanel user={sidebarUser} />
      </div>
    </ProtectedRoute>
  );
}

function CommentAsPost({ comment, onPostClick, onProfileClick }) {
  const [authorUsername, setAuthorUsername] = useState(
    comment.username || comment.author?.username || null
  );

  useEffect(() => {
    if (authorUsername || !comment.user_id) return;

    meService
      .getProfileById(comment.user_id)
      .then((result) => {
        const data = result?.data || result;
        if (data?.username) setAuthorUsername(data.username);
      })
      .catch(() => { });
  }, [comment.user_id]);

  const username =
    authorUsername || `user-${String(comment.user_id || "").slice(0, 6)}`;
  const tag = username.toLowerCase().replace(/\s+/g, "_");
  const timeAgo = formatRelativeTime(comment.createdAt || comment.created_at);


  return (
    <div
      className="bg-white border border-gray-100 rounded-xl p-4">
      {/* Lien vers le post original */}
      {comment.post_id && (
        <button
          onClick={onPostClick}
          className="text-xs text-green-500 hover:underline mb-3 block"
        >
          ↩ Voir le post original
        </button>
      )}

      <div className="flex gap-3">
        <button
          onClick={onProfileClick}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-500 flex-shrink-0 hover:opacity-80 transition-opacity"
        >
          {username[0]?.toUpperCase()}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={onProfileClick}
              className="font-semibold text-sm text-gray-900 hover:underline"
            >
              {username}
            </button>
            <span className="text-xs text-gray-400">@{tag}</span>
            <span className="text-gray-300 text-xs">·</span>
            <span className="text-xs text-gray-400">{timeAgo}</span>
          </div>

          {/* Contenu plus grand, comme un post */}
          <p className="text-base text-gray-800 mt-2 leading-relaxed">
            {comment.content || comment.comment_content || ""}
          </p>
        </div>
      </div>

      {/* Séparateur */}
      <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400">
        {timeAgo} · <span className="text-gray-500">Commentaire</span>
      </div>
    </div>
  );
}


function ReplyCard({ reply, disableNavigation = false }) {
  const router = useRouter();
  const [authorUsername, setAuthorUsername] = useState(
    reply.username || reply.author?.username || null
  );

  useEffect(() => {
    if (authorUsername || !reply.user_id) return;

    meService
      .getProfileById(reply.user_id)
      .then((result) => {
        const data = result?.data || result;
        if (data?.username) setAuthorUsername(data.username);
      })
      .catch(() => { });
  }, [reply.user_id]);

  const username =
    authorUsername || `user-${String(reply.user_id || "").slice(0, 6)}`;
  const tag = username.toLowerCase().replace(/\s+/g, "_");
  const timeAgo = formatRelativeTime(reply.createdAt || reply.created_at);

  const goToComment = () => {
    console.log(reply)
    if (!disableNavigation && reply.post_id) router.push(`/comment/${reply.comment_id}`);
  };

  return (
    <div
      onClick={goToComment}
      className="bg-white border border-gray-100 rounded-xl p-4 flex gap-3">
      <button
        onClick={() => reply.user_id && router.push(`/profile/${reply.user_id}`)}
        className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-500 flex-shrink-0 hover:opacity-80 transition-opacity"
      >
        {username[0]?.toUpperCase()}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => reply.user_id && router.push(`/profile/${reply.user_id}`)}
            className="font-semibold text-sm text-gray-900 hover:underline"
          >
            {username}
          </button>
          <span className="text-xs text-gray-400">@{tag}</span>
          <span className="text-gray-300 text-xs">·</span>
          <span className="text-xs text-gray-400">{timeAgo}</span>
        </div>
        <p className="text-sm text-gray-700 mt-1 leading-relaxed">
          {reply.content || reply.comment_content || ""}
        </p>
      </div>
    </div>
  );
}