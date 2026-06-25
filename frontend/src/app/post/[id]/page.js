"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter, MoreHorizontal, Trash2 } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import RightPanel from "@/components/RightPanel";
import PostCard from "@/components/PostCard";
import postService from "@/core/services/post.service";
import commentService from "@/core/services/comment.service";
import meService from "@/core/services/me.service";
import { formatRelativeTime } from "@/utils/timeFormat";

const MAX_COMMENT_CHAR = 280;

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user: authUser, logout } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        setLoadingPost(true);
        const result = await postService.getById(id);
        setPost(result?.data || result);
      } catch {
        setError("Post introuvable");
      } finally {
        setLoadingPost(false);
      }
    };

    const fetchComments = async () => {
      try {
        setLoadingComments(true);
        const result = await postService.getComments(id);
        setComments(result?.data || result || []);
      } catch {
        setComments([]);
      } finally {
        setLoadingComments(false);
      }
    };

    fetchPost();
    fetchComments();
  }, [id]);

  const handleSubmitComment = async () => {
    if (!commentText.trim() || submitting || !id) return;

    setSubmitting(true);
    try {
      const result = await commentService.create(
        { content: commentText.trim() }, // body
        id                               // post_id en query param
      );
      const newComment = result?.data || result;
      setComments((prev) => [newComment, ...prev]);
      setCommentText("");
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
              <h1 className="text-xl font-bold">Breeze</h1>
            </div>

            {/* Post */}
            {loadingPost ? (
              <div className="bg-white border border-gray-100 rounded-xl p-6 text-center">
                <p className="text-gray-400">Chargement...</p>
              </div>
            ) : error || !post ? (
              <div className="bg-white border border-gray-100 rounded-xl p-6 text-center">
                <p className="text-red-400">{error || "Post introuvable"}</p>
              </div>
            ) : (
              <PostCard post={post} disableNavigation={true} onDelete={() => router.back()} />
            )}

            {/* Zone de commentaire */}
            {!loadingPost && !error && post && (
              <div className="mt-4 bg-white border border-gray-100 rounded-xl p-4 flex gap-3 items-start">
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600 flex-shrink-0">
                  {authUser?.username?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Ajouter un commentaire..."
                    rows={2}
                    maxLength={MAX_COMMENT_CHAR}
                    className="w-full resize-none text-sm text-gray-700 placeholder-gray-400 border-none outline-none bg-transparent"
                  />
                  <div className="flex justify-between mt-1 text-xs text-gray-400">
                    <span />
                    <span>
                      {commentText.length} / {MAX_COMMENT_CHAR}
                    </span>
                  </div>
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleSubmitComment}
                      disabled={!commentText.trim() || submitting}
                      className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
                    >
                      <Send size={13} />
                      {submitting ? "Envoi..." : "Commenter"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Liste des commentaires */}
            <div className="mt-4 space-y-3">
              {loadingComments ? (
                <p className="text-center text-gray-400 text-sm py-4">
                  Chargement des commentaires...
                </p>
              ) : comments.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-4">
                  Aucun commentaire pour le moment
                </p>
              ) : (
                comments.map((comment) => (
                  <CommentCard
                    key={comment.comment_id || comment.id}
                    comment={comment}
                    onDelete={(commentId) =>
                      setComments((prev) =>
                        prev.filter((c) => (c.comment_id || c.id) !== commentId)
                      )
                    }
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

function CommentCard({ comment }) {
  const router = useRouter();
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
  const commentId = comment.comment_id || comment.id;

  return (
    <div
      onClick={() => commentId && router.push(`/comment/${commentId}`)}
      className="bg-white border border-gray-100 rounded-xl p-4 flex gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          comment.user_id && router.push(`/profile/${comment.user_id}`);
        }}
        className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-500 flex-shrink-0 hover:opacity-80 transition-opacity"
      >
        {username[0]?.toUpperCase()}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={(e) => {
              e.stopPropagation();
              comment.user_id && router.push(`/profile/${comment.user_id}`);
            }}
            className="font-semibold text-sm text-gray-900 hover:underline"
          >
            {username}
          </button>
          <span className="text-xs text-gray-400">@{tag}</span>
          <span className="text-gray-300 text-xs">·</span>
          <span className="text-xs text-gray-400">{timeAgo}</span>
        </div>
        <p className="text-sm text-gray-700 mt-1 leading-relaxed">
          {comment.content || comment.comment_content || ""}
        </p>
      </div>
    </div>
  );
}