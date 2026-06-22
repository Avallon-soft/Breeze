"use client";

import { useState } from "react";
import { Heart, MessageCircle, Repeat2, Send, MoreHorizontal } from "lucide-react";
import CountdownRing from "./CountdownRing";

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const progress = post.minutesLeft / post.totalMinutes;

  return (
    <article className="bg-white border border-gray-100 rounded-xl p-4 flex gap-3 items-start">
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <span className="text-xs text-gray-400 font-medium">{post.timeLeft}</span>
        <CountdownRing progress={progress} size={48} strokeWidth={3}>
          <img
            src={post.profile}
            alt={post.username}
            className="w-9 h-9 rounded-full object-cover"
          />
        </CountdownRing>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-sm flex-wrap">
            <span className="font-semibold text-gray-900">{post.username}</span>
            <span className="text-gray-400">@{post.tag}</span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-400">{post.timeAgo}</span>
          </div>
          <button className="text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0">
            <MoreHorizontal size={16} />
          </button>
        </div>

        <p className="text-sm text-gray-700 mt-1.5 leading-relaxed">{post.content}</p>

        {post.image && (
          <img
            src={post.image}
            alt=""
            className="mt-3 rounded-lg w-full object-cover max-h-56"
          />
        )}

        {post.link && (
          <div className="mt-3 border border-gray-100 rounded-lg overflow-hidden flex">
            {post.link.image && (
              <img
                src={post.link.image}
                alt=""
                className="w-24 h-20 object-cover flex-shrink-0"
              />
            )}
            <div className="p-3 min-w-0">
              <p className="text-sm font-semibold text-gray-900 leading-snug">
                {post.link.title}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                {post.link.description}
              </p>
              <p className="text-xs text-green-500 mt-1">{post.link.url}</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-5 mt-3">
          <button
            onClick={() => setLiked((prev) => !prev)}
            className={`flex items-center gap-1.5 text-sm transition-colors ${
              liked ? "text-red-500" : "text-gray-400 hover:text-red-400"
            }`}
          >
            <Heart size={15} fill={liked ? "currentColor" : "none"} />
            {post.likes + (liked ? 1 : 0)}
          </button>
          <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-blue-400 transition-colors">
            <MessageCircle size={15} />
            {post.comments}
          </button>
          <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-green-500 transition-colors">
            <Repeat2 size={15} />
            {post.reposts}
          </button>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <Send size={15} />
          </button>
        </div>
      </div>

      <CountdownRing progress={progress} size={90} strokeWidth={4} className="self-center">
        <div className="text-center px-1">
          <p className="text-[10px] text-gray-400 leading-none">Encore</p>
          <p className="text-sm font-bold text-gray-800 leading-tight mt-0.5">
            {post.timeLeft}
          </p>
          <p className="text-[10px] text-gray-400 leading-none mt-0.5">
            pour en profiter
          </p>
        </div>
      </CountdownRing>
    </article>
  );
}