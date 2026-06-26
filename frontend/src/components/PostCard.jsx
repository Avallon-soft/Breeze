"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heart, MessageCircle, Repeat2, Send,
  MoreHorizontal, Trash2, Pencil, X, Check,
} from "lucide-react";
import CountdownRing from "./CountdownRing";
import postService from "@/core/services/post.service";
import meService from "@/core/services/me.service";
import likeService from "@/core/services/like.service";
import { useAuth } from "@/context/AuthContext";
import { formatNumber } from "@/lib/utils";
import { formatRelativeTime, formatTimeLeft, computeProgress } from "@/utils/timeFormat";
import { getAuthor, getCountValue, extractPostFields } from "@/utils/postHelpers";

export default function PostCard({ post, disableNavigation = false, onDelete }) {
  const router = useRouter();
  const { user: authUser } = useAuth();
  const menuRef = useRef(null);

  const baseAuthor = useMemo(() => getAuthor(post), [post]);
  const [resolvedAuthor, setResolvedAuthor] = useState(baseAuthor);

  const { content: initialContent, image, link, createdAt, expiresAt } = extractPostFields(post);
  const [displayContent, setDisplayContent] = useState(initialContent);
  const [editContent, setEditContent] = useState(initialContent);

  const [liked, setLiked] = useState(Boolean(post.is_liked || post.isLiked || post.liked));
  const [likeCount, setLikeCount] = useState(getCountValue(post.likes_count ?? post.likesCount ?? post.likes));
  const [commentCount, setCommentCount] = useState(getCountValue(post.commentsCount ?? post.comments));
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingCounts, setLoadingCounts] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner =
    authUser?.id === post.user_id ||
    authUser?.user_id === post.user_id;

  const progress = computeProgress(post);
  const timeAgo = post.timeAgo || formatRelativeTime(createdAt);
  const timeLeft = post.timeLeft || formatTimeLeft(expiresAt);
  const timeLabel = timeLeft ? "Encore" : "Publié";
  const timeValue = timeLeft || timeAgo || "—";
  const timeCaption = timeLeft ? "pour en profiter" : timeAgo ? "sur le feed" : "";

  // Fermer le menu au clic extérieur
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Résoudre le username
  useEffect(() => {
    const needsFetch =
      post.user_id &&
      (!baseAuthor.username ||
        baseAuthor.username === post.user_id ||
        baseAuthor.username === "Utilisateur");
    if (!needsFetch) return;
    meService
      .getProfileById(post.user_id)
      .then((result) => {
        const data = result?.data || result;
        const username = data?.username || data?.name;
        if (username) {
          setResolvedAuthor({
            username,
            tag: username.toLowerCase().replace(/\s+/g, "_"),
            profile: data?.avatar || data?.image || null,
          });
        }
      })
      .catch(() => { });
  }, [post.user_id]);

  useEffect(() => {
    setLiked(Boolean(post.is_liked || post.isLiked || post.liked));
  }, [post.is_liked, post.isLiked, post.liked, post.post_id]);

  useEffect(() => {
    setLikeCount(getCountValue(post.likes_count ?? post.likesCount ?? post.likes));
    setCommentCount(getCountValue(post.commentsCount ?? post.comments));
  }, [post.post_id]);

  useEffect(() => {
    if (!post.post_id) return;
    const hasLikeCount =
      typeof post.likes_count === "number" ||
      typeof post.likesCount === "number" ||
      Array.isArray(post.likes);
    const hasCommentCount =
      typeof post.commentsCount === "number" || Array.isArray(post.comments);
    if (hasLikeCount && hasCommentCount) return;
    let cancelled = false;
    const fetchCounts = async () => {
      try {
        setLoadingCounts(true);
        const [likes, comments] = await Promise.all([
          hasLikeCount ? Promise.resolve(post.likes) : postService.getLikes(post.post_id),
          hasCommentCount ? Promise.resolve(post.comments) : postService.getComments(post.post_id),
        ]);
        if (!cancelled) {
          if (!hasLikeCount) setLikeCount(getCountValue(likes));
          if (!hasCommentCount) setCommentCount(getCountValue(comments));
        }
      } catch {
      } finally {
        if (!cancelled) setLoadingCounts(false);
      }
    };
    fetchCounts();
    return () => { cancelled = true; };
  }, [post.post_id]);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (loadingLike || !post.post_id) return;
    const prevLiked = liked;
    const prevCount = likeCount;
    setLiked(!prevLiked);
    setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1);
    setLoadingLike(true);
    try {
      const result = await likeService.toggleLike(post.post_id);
      if (result?.data?.liked === false) setLiked(false);
      else if (result?.data?.like_id) setLiked(true);
    } catch {
      setLiked(prevLiked);
      setLikeCount(prevCount);
    } finally {
      setLoadingLike(false);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (deleting) return;
    setMenuOpen(false);
    setDeleting(true);
    try {
      await postService.delete(post.post_id);
      if (onDelete) onDelete(post.post_id);
      else router.back();
    } catch {
    } finally {
      setDeleting(false);
    }
  };

  const handleSaveEdit = async (e) => {
    e.stopPropagation();
    if (!editContent.trim() || savingEdit) return;
    setSavingEdit(true);
    try {
      await postService.update(post.post_id, { content: editContent.trim() });
      setDisplayContent(editContent.trim());
      setEditing(false);
    } catch {
    } finally {
      setSavingEdit(false);
    }
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setEditContent(displayContent);
    setEditing(false);
  };

  const goToProfile = (e) => {
    e.stopPropagation();
    if (post.user_id) router.push(`/profile/${post.user_id}`);
  };

  const goToPost = () => {
    if (!disableNavigation && post.post_id) router.push(`/post/${post.post_id}`);
  };

  return (
    <article
      onClick={goToPost}
      className={`bg-white border border-gray-100 rounded-xl p-4 flex gap-3 items-start ${!disableNavigation ? "cursor-pointer hover:bg-gray-50 transition-colors" : ""
        }`}
    >
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <span className="text-sm text-gray-400 font-medium">{timeValue}</span>
        <button onClick={goToProfile} className="focus:outline-none">
          <CountdownRing progress={progress} size={48} strokeWidth={3}>
            {resolvedAuthor.profile ? (
              <img
                src={resolvedAuthor.profile}
                alt={resolvedAuthor.username}
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-sm font-semibold">
                {resolvedAuthor.username.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
              </div>
            )}
          </CountdownRing>
        </button>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-base flex-wrap">
            <button
              onClick={goToProfile}
              className="font-semibold text-gray-900 hover:underline focus:outline-none"
            >
              {resolvedAuthor.username}
            </button>
            <span className="text-gray-300">·</span>
            <span className="text-gray-400">{timeAgo || "Publié récemment"}</span>
          </div>
        </div>

        {editing ? (
          <div onClick={(e) => e.stopPropagation()} className="mt-1.5">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
              maxLength={280}
              className="w-full resize-none text-base text-gray-700 border border-gray-200 rounded-lg p-2 outline-none focus:border-green-400 bg-white"
            />
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-gray-400">{editContent.length} / 280</span>
              <div className="flex gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <X size={12} />
                  Annuler
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={!editContent.trim() || savingEdit}
                  className="flex items-center gap-1 text-xs text-white bg-green-500 hover:bg-green-600 px-2 py-1 rounded-lg disabled:opacity-60 transition-colors"
                >
                  <Check size={12} />
                  {savingEdit ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: displayContent }} className="text-base text-gray-700 mt-1.5 leading-relaxed break-words break-all whitespace-pre-wrap overflow-hidden" />
        )}

        {image && <img src={image} alt="" className="mt-3 rounded-lg w-full object-cover max-h-56" />}

        {link && (
          <div className="mt-3 border border-gray-100 rounded-lg overflow-hidden flex">
            {link.image && <img src={link.image} alt="" className="w-24 h-20 object-cover flex-shrink-0" />}
            <div className="p-3 min-w-0">
              <p className="text-base font-semibold text-gray-900 leading-snug">{link.title}</p>
              <p className="text-sm text-gray-400 mt-0.5 leading-snug">{link.description}</p>
              <p className="text-sm text-green-500 mt-1">{link.url}</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-5 mt-3">
          <button
            onClick={handleLike}
            disabled={loadingLike}
            className={`flex items-center gap-1.5 text-base transition-colors disabled:opacity-60 ${liked ? "text-red-500" : "text-gray-400 hover:text-red-400"
              }`}
          >
            <Heart size={15} fill={liked ? "currentColor" : "none"} />
            {formatNumber(likeCount)}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (post.post_id) router.push(`/post/${post.post_id}`);
            }}
            className="flex items-center gap-1.5 text-base text-gray-400 hover:text-blue-400 transition-colors"
          >
            <MessageCircle size={15} />
            {formatNumber(commentCount)}
          </button>
        </div>
      </div>

      <CountdownRing progress={progress} size={90} strokeWidth={4} className="self-center">
        <div className="text-center px-1">
          <p className="text-[10px] text-gray-400 leading-none">{timeLabel}</p>
          <p className="text-base font-bold text-gray-800 leading-tight mt-0.5">
            {loadingCounts && !timeLeft && !timeAgo ? "..." : timeValue}
          </p>
          <p className="text-[10px] text-gray-400 leading-none mt-0.5">{timeCaption}</p>
        </div>
      </CountdownRing>
      {/* Menu 3 points */}
      <div className="relative flex-shrink-0" ref={menuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((prev) => !prev);
          }}
          className="text-gray-300 hover:text-gray-500 transition-colors p-1"
        >
          <MoreHorizontal size={16} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-7 bg-white border border-gray-100 rounded-xl shadow-lg z-50 min-w-[140px] overflow-hidden">
            {isOwner ? (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    setEditing(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Pencil size={14} />
                  Modifier
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors disabled:opacity-60"
                >
                  <Trash2 size={14} />
                  {deleting ? "Suppression..." : "Supprimer"}
                </button>
              </>
            ) : ""}
          </div>
        )}
      </div>
    </article>
  );
}