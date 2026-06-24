"use client";

import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";
import RightPanel from "@/components/RightPanel";
import ProtectedRoute from "@/components/ProtectedRoute";
import postService from "@/core/services/post.service";
import feedService from "@/core/services/feed.service";
import meService from "@/core/services/me.service";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, feedData] = await Promise.all([
          meService.getProfile(),
          feedService.get(),
        ]);

        setProfile(profileData);
        // Normalise selon ce que ton apiHandler retourne
        setPosts(feedData?.data || feedData || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const handleLogout = () => {
    logout();
    router.push("/signin");
  };

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const sidebarUser = profile ? {
    name: profile.username || "Utilisateur",
    tag: profile.username?.toLowerCase().replace(/\s+/g, "_") || "user",
    profile: "https://i.pravatar.cc/100?img=12",
    subscriptions: 0,
    subscribers: 0,
    posts: 0,
    userId: profile.user_id || null,
  } : null;


  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen bg-gray-50 items-center justify-center">
          <p className="text-gray-500">Chargement...</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        {sidebarUser && <Sidebar user={sidebarUser} onLogout={handleLogout} />}

        <main className="flex-1 h-screen overflow-y-auto border-x border-gray-100">
          <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">
            <h1 className="text-2xl font-semibold text-gray-900">Accueil</h1>
            {profile && <CreatePost user={sidebarUser} onPostCreated={handlePostCreated} />}
            <p className="text-sm text-gray-400 mt-0.5">
              Des breezes qui circulent en ce moment
            </p>
            <section className="flex flex-col gap-4">
              {posts.length === 0 ? (
                <p className="text-gray-500">Aucune breeze pour le moment</p>
              ) : (
                posts.map((post) => (
                  <PostCard key={post.post_id} post={post} />
                ))
              )}
            </section>
          </div>
        </main>

        {sidebarUser && <RightPanel user={sidebarUser} />}
      </div>
    </ProtectedRoute>
  );
}