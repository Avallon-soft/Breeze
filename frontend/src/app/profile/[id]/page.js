"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import RightPanel from "@/components/RightPanel";
import PostCard from "@/components/PostCard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { formatNumber } from "@/lib/utils";
import { useParams } from "next/navigation";
import followService from "@/core/services/follow.service";
import meService from "@/core/services/me.service";
import { Pencil, Camera, Check, X, Loader2 } from "lucide-react";

const PICTRS_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE + "/image/original/";

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("images[]", file);

  const res = await fetch(process.env.NEXT_PUBLIC_IMAGE_BASE + "/image", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");

  const data = await res.json();

  const fileId = data.files[0].file;

  return PICTRS_BASE + fileId;
}

function ImageDropZone({ onUpload, uploading, rounded = false, children }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFile = useCallback(
    async (file) => {
      if (!file || !file.type.startsWith("image/")) return;
      await onUpload(file);
    },
    [onUpload]
  );

  return (
    <div
      className={`relative group cursor-pointer ${dragging ? "opacity-75" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
      onClick={() => inputRef.current?.click()}
    >
      {children}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        style={{ display: "none" }}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
      />

      <div
        className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${rounded ? "rounded-full" : "rounded-b-[32px]"} ${dragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
      >
        {/* {uploading
          ? <Loader2 className="w-5 h-5 text-white animate-spin" />
          : <Camera className="w-5 h-5 text-white" />
        } */}
      </div>
    </div>
  );
}

function EditableField({ value, onSave, multiline = false, placeholder = "", maxLength, className = "" }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { setDraft(value); }, [value]);
  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  const save = async () => {
    if (draft === value) { setEditing(false); return; }
    setSaving(true);
    try { await onSave(draft); setEditing(false); }
    catch { /* le parent gère l'erreur */ }
    finally { setSaving(false); }
  };

  const cancel = () => { setDraft(value); setEditing(false); };

  if (editing) {
    const inputClass = "bg-gray-100 border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none w-full";
    return (
      <div className="flex flex-col gap-1.5">
        {multiline
          ? <textarea ref={inputRef} rows={3} value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={maxLength} placeholder={placeholder} onKeyDown={(e) => { if (e.key === "Escape") cancel(); }} className={inputClass} />
          : <input ref={inputRef} type="text" value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={maxLength} placeholder={placeholder} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); save(); } if (e.key === "Escape") cancel(); }} className={inputClass} />
        }
        {maxLength && <p className="text-xs text-gray-400 text-right">{draft.length}/{maxLength}</p>}
        <div className="flex gap-2">
          <button onClick={save} disabled={saving} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs font-medium hover:bg-green-600 disabled:opacity-50 transition-colors">
            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
            Enregistrer
          </button>
          <button onClick={cancel} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition-colors">
            <X className="w-3 h-3" />
            Annuler
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`group flex items-center gap-2 ${className}`}>
      <span className={value ? "" : "text-gray-400 italic"}>{value || placeholder}</span>
      <button
        onClick={(e) => { e.stopPropagation(); setEditing(true); }}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-green-500 flex-shrink-0"
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function ProfilePage() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const { logout, user: authUser } = useAuth();
  const { profile, posts, stats, loading, error } = useUserProfile(id);

  const isOwnProfile =
    authUser?.user_id === id ||
    authUser?.id === id ||
    authUser?.uuid === id;

  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [checkingFollow, setCheckingFollow] = useState(false);

  const [localProfile, setLocalProfile] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  useEffect(() => { if (profile) setLocalProfile(profile); }, [profile]);

  useEffect(() => {
    if (stats?.followersCount !== undefined) setFollowersCount(stats.followersCount);
  }, [stats?.followersCount]);

  useEffect(() => {
    if (!id || isOwnProfile) return;
    const check = async () => {
      try {
        setCheckingFollow(true);
        const result = await followService.checkFollow(id);
        const data = result?.data || result;
        setIsFollowing(Boolean(data?.following));
      } catch {
        setIsFollowing(false);
      } finally {
        setCheckingFollow(false);
      }
    };
    check();
  }, [id, isOwnProfile]);

  const saveField = async (field, value) => {
    const currentProfile = localProfile || profile;

    const updated = await meService.upsertProfile({
      username: currentProfile.username,
      bio: currentProfile.bio,
      avatar: currentProfile.avatar,
      banner: currentProfile.banner,
      [field]: value,
    });

    const data = updated?.data || updated;
    setLocalProfile((prev) => ({ ...prev, ...data }));
  };

  const handleUploadAvatar = async (file) => {
    setUploadingAvatar(true);
    try {
      const url = await uploadImage(file);
      await saveField("avatar", url);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleUploadBanner = async (file) => {
    setUploadingBanner(true);
    try {
      const url = await uploadImage(file);
      await saveField("banner", url);
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleFollowToggle = async () => {
    if (loadingFollow) return;
    const wasFollowing = isFollowing;
    setIsFollowing(!wasFollowing);
    setFollowersCount((c) => (wasFollowing ? c - 1 : c + 1));
    setLoadingFollow(true);
    try {
      if (wasFollowing) await followService.unfollow(id);
      else await followService.follow(id);
    } catch {
      setIsFollowing(wasFollowing);
      setFollowersCount((c) => (wasFollowing ? c + 1 : c - 1));
    } finally {
      setLoadingFollow(false);
    }
  };

  const handleLogout = () => { logout(); router.push("/signin"); };

  const userForSidebar = {
    name: authUser?.username || "Utilisateur",
    tag: authUser?.username?.toLowerCase().replace(/\s+/g, "_") || "user",
    profile: authUser?.avatar ? authUser?.avatar : "https://i.pravatar.cc/100?img=12",
    userId: authUser?.user_id,
  };

  const displayProfile = localProfile || profile;
  const avatarUrl = displayProfile?.avatar;
  const bannerUrl = displayProfile?.banner;

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen bg-gray-50 items-center justify-center">
          <p className="text-gray-500">Chargement du profil...</p>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !displayProfile) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen bg-gray-50 items-center justify-center">
          <p className="text-red-500">
            {error || "Erreur lors du chargement du profil"}
          </p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar user={userForSidebar} onLogout={handleLogout} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto pb-20">

            {isOwnProfile ? (
              <ImageDropZone onUpload={handleUploadBanner} uploading={uploadingBanner}>
                <div className="h-72 rounded-b-[32px] overflow-hidden relative">
                  <img
                    src={bannerUrl || "https://picsum.photos/1400/500"}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>
              </ImageDropZone>
            ) : (
              <div className="h-72 rounded-b-[32px] overflow-hidden relative">
                <img
                  src={bannerUrl || "https://picsum.photos/1400/500"}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>
            )}

            <div className="px-8">
              <div className="flex justify-between items-end -mt-16">

                {isOwnProfile ? (
                  <ImageDropZone onUpload={handleUploadAvatar} uploading={uploadingAvatar} rounded>
                    <div className="w-36 h-36 rounded-full border-8 border-white bg-gray-200 flex items-center justify-center text-4xl font-bold text-white overflow-hidden z-10">
                      {avatarUrl
                        ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                        : <span>{displayProfile.username?.[0]?.toUpperCase() || "U"}</span>
                      }
                    </div>
                  </ImageDropZone>
                ) : (
                  <div className="w-36 h-36 rounded-full border-8 border-white bg-gray-200 flex items-center justify-center text-4xl font-bold text-white overflow-hidden z-10">
                    {avatarUrl
                      ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                      : <span>{displayProfile.username?.[0]?.toUpperCase() || "U"}</span>
                    }
                  </div>
                )}

                {isOwnProfile ? (
                  <button
                    onClick={handleLogout}
                    className="h-12 px-6 rounded-xl border border-red-200 bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors"
                  >
                    Déconnexion
                  </button>
                ) : (
                  <button
                    onClick={handleFollowToggle}
                    disabled={loadingFollow || checkingFollow}
                    className={`h-12 px-6 rounded-xl font-medium transition-colors disabled:opacity-50 ${isFollowing
                      ? "border border-gray-200 bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                      : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                  >
                    {checkingFollow ? "..." : isFollowing ? "Se désabonner" : "S'abonner"}
                  </button>
                )}
              </div>

              <div className="mt-5">
                {isOwnProfile ? (
                  <>
                    <EditableField
                      value={displayProfile.username || ""}
                      placeholder="Ton nom d'utilisateur"
                      onSave={(val) => saveField("username", val)}
                      maxLength={30}
                      className="text-3xl font-bold"
                    />
                    <div className="mt-2 max-w-lg">
                      <EditableField
                        value={displayProfile.bio || ""}
                        placeholder="Ajouter une bio…"
                        multiline
                        onSave={(val) => saveField("bio", val)}
                        maxLength={300}
                        className="text-gray-500 text-sm"
                      />
                    </div>
                    {authUser?.email && (
                      <p className="text-gray-400 text-xs mt-1">{authUser.email}</p>
                    )}
                  </>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold">
                      {displayProfile.username || "Utilisateur"}
                    </h1>
                    {displayProfile.bio && (
                      <p className="text-gray-500 mt-2 max-w-lg text-sm">{displayProfile.bio}</p>
                    )}
                  </>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 mt-8">
                <Stat value={formatNumber(stats.followingCount)} label="Abonnements" />
                <Stat value={formatNumber(followersCount)} label="Abonnés" />
                <Stat value={formatNumber(stats.postsCount)} label="Breezes" />
              </div>

              {/* POSTS */}
              <div className="mt-10">
                <h2 className="font-semibold text-xl mb-6">Breezes actives</h2>
                {posts.length === 0 ? (
                  <p className="text-gray-500">Aucune breeze pour le moment</p>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <PostCard key={post.post_id} post={post} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <RightPanel user={userForSidebar} />
      </div>
    </ProtectedRoute>
  );
}

function Stat({ value, label }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 text-center">
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-gray-500 text-sm mt-1">{label}</p>
    </div>
  );
}