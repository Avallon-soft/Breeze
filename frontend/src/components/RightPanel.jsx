"use client";

import { useState } from "react";
import { X } from "lucide-react";
import CountdownRing from "./CountdownRing";
import { expiringPosts, suggestions } from "@/lib/data";
import { formatNumber } from "@/lib/utils";

export default function RightPanel({ user }) {
  const [dismissed, setDismissed] = useState([]);

  const visibleSuggestions = suggestions.filter((s) => !dismissed.includes(s.id));

  return (
    <aside
      className="w-80 h-screen flex-shrink-0 overflow-y-auto flex flex-col gap-4 px-4 py-6 [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: "none" }}
    >
      <div className="bg-white border border-gray-100 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Mon espace</h3>
        <div className="flex items-center gap-3 mb-4">
          <img
            src={user.profile}
            alt={user.name}
            className="w-14 h-14 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-sm text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-400">@{user.tag}</p>
          </div>
        </div>
        <div className="flex justify-between border-t border-gray-50 pt-3">
          <Stat value={formatNumber(user.subscriptions)} label="Abonnements" />
          <Stat value={formatNumber(user.subscribers)} label="Abonnés" />
          <Stat value={formatNumber(user.posts)} label="Breezes" />
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">S'éteint bientôt</h3>
          <button className="text-green-500 text-xs font-medium hover:text-green-600 transition-colors">
            Voir tout
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {expiringPosts.map((item) => (
            <ExpiringItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Suggestions pour vous</h3>
          <button className="text-green-500 text-xs font-medium hover:text-green-600 transition-colors">
            Voir tout
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {visibleSuggestions.map((s) => (
            <SuggestionItem
              key={s.id}
              suggestion={s}
              onDismiss={() => setDismissed((prev) => [...prev, s.id])}
            />
          ))}
        </div>
      </div>

      <div className="text-center pb-2 mt-auto">
        <p className="text-xs text-gray-300">
          Aide · Confidentialité · Conditions d'utilisation
        </p>
        <p className="text-xs text-gray-200 mt-1">© 2026 Breeze</p>
      </div>
    </aside>
  );
}

function Stat({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-sm font-bold text-gray-900">{value}</span>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  );
}

function ExpiringItem({ item }) {
  return (
    <div className="flex items-center gap-2.5">
      <CountdownRing progress={item.progress} size={40} strokeWidth={2.5}>
        <img
          src={item.profile}
          alt={item.name}
          className="w-7 h-7 rounded-full object-cover"
        />
      </CountdownRing>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 leading-tight">{item.name}</p>
        <p className="text-xs text-gray-400 truncate leading-tight">{item.content}</p>
        <p className="text-xs text-gray-300 leading-tight">{item.timeLeft}</p>
      </div>
      {item.thumbnail && (
        <img
          src={item.thumbnail}
          alt=""
          className="w-11 h-11 rounded-lg object-cover flex-shrink-0"
        />
      )}
    </div>
  );
}

function SuggestionItem({ suggestion, onDismiss }) {
  const [following, setFollowing] = useState(false);

  return (
    <div className="flex items-center gap-2.5">
      <img
        src={suggestion.profile}
        alt={suggestion.name}
        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 leading-tight truncate">
          {suggestion.name}
        </p>
        <p className="text-xs text-gray-400 leading-tight">@{suggestion.tag}</p>
      </div>
      <button
        onClick={() => setFollowing((prev) => !prev)}
        className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors flex-shrink-0 ${
          following
            ? "border-green-500 text-green-600 bg-green-50"
            : "border-gray-200 text-gray-700 hover:bg-gray-50"
        }`}
      >
        {following ? "Suivi" : "Suivre"}
      </button>
      <button
        onClick={onDismiss}
        className="text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  );
}