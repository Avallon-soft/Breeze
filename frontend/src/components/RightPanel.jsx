"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { formatNumber } from "@/lib/utils";

export default function RightPanel() {
  const [dismissed, setDismissed] = useState([]);

  const { user: authUser } = useAuth();

  // 👇 même logique que ProfilePage
  const { profile, stats } = useUserProfile(authUser?.user_id);

  const visibleSuggestions = []; // inchangé ou futur fetch API

  if (!profile || !stats) return null;

  return (
    <aside
      className="w-80 h-screen flex-shrink-0 overflow-y-auto flex flex-col gap-4 px-4 py-6 [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: "none" }}
    >
      {/* MON ESPACE */}
      <div className="bg-white border border-gray-100 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Mon espace
        </h3>

        <div className="flex items-center gap-3 mb-4">
          <img
            src={profile.avatar || "https://i.pravatar.cc/100"}
            alt={profile.username}
            className="w-14 h-14 rounded-full object-cover"
          />

          <div>
            <p className="font-semibold text-sm text-gray-900">
              {profile.username}
            </p>
            <p className="text-xs text-gray-400">
              @{profile.username?.toLowerCase()}
            </p>
          </div>
        </div>

        <div className="flex justify-between border-t border-gray-50 pt-3">
          <Stat value={formatNumber(stats.followingCount)} label="Abonnements" />
          <Stat value={formatNumber(stats.followersCount)} label="Abonnés" />
          <Stat value={formatNumber(stats.postsCount)} label="Breezes" />
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