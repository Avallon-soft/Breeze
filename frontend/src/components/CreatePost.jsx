"use client";

import { useState } from "react";
import { Info } from "lucide-react";

const durations = ["1 h", "3 h", "12 h", "24 h"];

export default function CreatePost({ user }) {
  const [content, setContent] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("12 h");

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 flex gap-3">
      <img
        src={user.profile}
        alt={user.name}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1 flex flex-col gap-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Qu'est-ce qui souffle aujourd'hui ..."
          rows={2}
          className="w-full resize-none text-sm text-gray-700 placeholder:text-gray-400 outline-none leading-relaxed"
        />
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500">Durée de la breeze</span>
              <Info size={13} className="text-gray-400" />
            </div>
            <div className="flex gap-1.5">
              {durations.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDuration(d)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedDuration === d
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <button className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            Publier
          </button>
        </div>
      </div>
    </div>
  );
}