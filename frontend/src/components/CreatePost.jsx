"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Info, AlertCircle, ImagePlus, Loader2, Trash2 } from "lucide-react";
import postService from "@/core/services/post.service";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";

const durations = ["1 h", "3 h", "12 h", "24 h"];

const durationToMs = {
  "1 h": 60 * 60 * 1000,
  "3 h": 3 * 60 * 60 * 1000,
  "12 h": 12 * 60 * 60 * 1000,
  "24 h": 24 * 60 * 60 * 1000,
};

const MAX_CHAR = 280;
const PICTRS_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE + "/image/original/";

async function uploadImage(file) {
  const formData = new FormData();
  formData.append("images[]", file);

  const res = await fetch(process.env.NEXT_PUBLIC_IMAGE_BASE + "/image", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Upload échoué");

  const data = await res.json();
  const fileId = data.files[0].file;
  return PICTRS_BASE + fileId;
}

// Génère un UUID v4 en utilisant crypto.randomUUID si disponible, sinon fallback sécurisé via getRandomValues
function safeRandomUUID() {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
      const bytes = crypto.getRandomValues(new Uint8Array(16));
      bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
      bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant
      const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
      return `${hex.substring(0,8)}-${hex.substring(8,12)}-${hex.substring(12,16)}-${hex.substring(16,20)}-${hex.substring(20)}`;
    }
  } catch (e) {
    // fallback to Math.random-based UUID (not cryptographically secure)
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Textarea qui grandit automatiquement
function AutoTextarea({ value, onChange, onFocus, placeholder, disabled }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      placeholder={placeholder}
      disabled={disabled}
      rows={3}
      maxLength={MAX_CHAR}
      style={{ overflow: "hidden" }}
      className="w-full resize-none text-base text-gray-700 placeholder:text-gray-400 outline-none leading-relaxed bg-transparent py-1 min-h-[72px]"
    />
  );
}

// Bloc image avec hover géré via state local (pas Tailwind group)
function ImageBlock({ block, onRemove }) {
  const [hovered, setHovered] = useState(false);

  if (block.uploading) {
    return (
      <div className="w-full h-36 bg-gray-100 rounded-lg flex items-center justify-center my-2">
        <Loader2 size={20} className="text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="relative my-2 rounded-lg overflow-hidden cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onRemove}
    >
      <img
        src={block.url}
        alt=""
        className="w-full max-h-64 object-cover"
      />
      {/* Overlay vert + poubelle uniquement au hover */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: hovered ? "rgba(34, 197, 94, 0.35)" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.15s ease",
        }}
      >
        <Trash2
          size={28}
          style={{
            color: "white",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.15s ease",
            filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.4))",
          }}
        />
      </div>
    </div>
  );
}

export default function CreatePost({ onPostCreated }) {
  const { user: authUser } = useAuth();
  const userId = authUser?.user_id;
  const { profile } = useUserProfile(userId);

  // Structure : { text: string, images: Array<{id, url, uploading}> }[]
  // Un seul textarea, les images sont insérées entre des "sections"
  // Simplification : un seul bloc texte + une liste d'images positionnées
  // On garde : content (string) + images (liste ordonnée avec position dans le texte)
  // Approche finale choisie : un textarea unique + images en dessous les unes des autres
  // L'ordre final : textarea content, puis chaque image dans l'ordre d'ajout
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]); // [{ id, url, uploading }]
  const [selectedDuration, setSelectedDuration] = useState("12 h");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [globalDragging, setGlobalDragging] = useState(false);

  const fileInputRef = useRef(null);

  const addImage = useCallback(async (file) => {
    if (!file || !file.type.startsWith("image/")) return;

    if (file.size > 1 * 1024 * 1024) {
      setError("L'image dépasse la taille maximale de 1 Mo");
      return;
    }

    const id = safeRandomUUID();
    setImages((prev) => [...prev, { id, url: "", uploading: true }]);

    try {
      const url = await uploadImage(file);
      setImages((prev) =>
        prev.map((img) => (img.id === id ? { ...img, url, uploading: false } : img))
      );
    } catch {
      setImages((prev) => prev.filter((img) => img.id !== id));
      setError("Échec de l'upload de l'image");
    }
  }, []);

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setGlobalDragging(true);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setGlobalDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setGlobalDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) addImage(file);
  };

  // Construit le post_content final
  const buildContent = () => {
    const parts = [];
    if (content.trim()) parts.push(content.trim());
    images.forEach((img) => {
      if (img.url) parts.push(`<img src="${img.url}" />`);
    });
    return parts.join("\n");
  };

  const totalChars = content.length;
  const hasContent =
    content.trim().length > 0 || images.some((img) => img.url);
  const isUploading = images.some((img) => img.uploading);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasContent || isUploading) return;

    setLoading(true);
    setError("");

    try {
      const expiresAt = new Date(Date.now() + durationToMs[selectedDuration]);
      const post_content = buildContent();

      const newPost = await postService.create({
        post_content,
        expiresAt: expiresAt.toISOString(),
      });

      setContent("");
      setImages([]);
      setSelectedDuration("12 h");
      onPostCreated?.(newPost);
    } catch (err) {
      setError(err.message || "Erreur lors de la création de la breeze");
    } finally {
      setLoading(false);
    }
  };

  const avatar =
    profile?.avatar ||
    profile?.profile ||
    `https://i.pravatar.cc/100?u=${userId}`;

  const name = profile?.username || "Utilisateur";

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 flex gap-3">
      <img
        src={avatar}
        alt={name}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />

      <div className="flex-1 flex flex-col gap-3">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2 items-start">
            <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Zone de rédaction */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="relative rounded-lg transition-all"
          style={{
            background: globalDragging ? "rgb(240 253 244)" : "transparent",
            outline: globalDragging ? "2px dashed rgb(134 239 172)" : "none",
          }}
        >
          {globalDragging && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
                pointerEvents: "none",
                gap: "4px",
              }}
            >
              <ImagePlus size={22} className="text-green-500" />
              <p className="text-sm text-green-600 font-medium">
                Déposer l'image ici
              </p>
            </div>
          )}

          <div style={{ opacity: globalDragging ? 0.3 : 1, pointerEvents: globalDragging ? "none" : "auto" }}>
            {/* Textarea unique qui grandit */}
            <AutoTextarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Qu'est-ce qui souffle aujourd'hui..."
              disabled={loading}
            />

            {/* Images sous le textarea */}
            {images.map((img) => (
              <ImageBlock
                key={img.id}
                block={img}
                onRemove={() => removeImage(img.id)}
              />
            ))}
          </div>
        </div>

        {/* Compteur */}
        <p className="text-xs text-gray-400 text-right">
          {totalChars} / {MAX_CHAR}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading || isUploading}
              className="flex items-center gap-1.5 text-gray-400 hover:text-green-500 transition-colors disabled:opacity-50 text-sm"
            >
              <ImagePlus size={16} />
              <span>Image</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) addImage(f);
                e.target.value = "";
              }}
              style={{ display: "none" }}
            />

            <div className="w-px h-4 bg-gray-200" />

            <div className="flex items-center gap-1.5">
              <span className="text-sm text-gray-500">Durée</span>
              <Info size={13} className="text-gray-400" />
            </div>
            <div className="flex gap-1.5">
              {durations.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDuration(d)}
                  disabled={loading}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors disabled:opacity-50 ${
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

          <button
            onClick={handleSubmit}
            disabled={loading || !hasContent || isUploading}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            {loading ? "Publication..." : "Publier"}
          </button>
        </div>
      </div>
    </div>
  );
}