"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import PostCard from "@/components/PostCard";
import RightPanel from "@/components/RightPanel";
import ProtectedRoute from "@/components/ProtectedRoute";
import postService from "@/core/services/post.service";
import meService from "@/core/services/me.service";
import { useAuth } from "@/context/AuthContext";
import userService from "@/core/services/user.service";

export default function ExplorePage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Recherche utilisateurs
  const [search, setSearch] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, postsData] = await Promise.all([
          meService.getProfile(),
          postService.getAll(),
        ]);
        setProfile(profileData);
        setPosts(postsData?.data || postsData || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Debounce recherche utilisateurs
  useEffect(() => {
    if (!search.trim()) {
      setUserResults([]);
      setShowDropdown(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const result = await userService.searchUsers(search.trim());
        const users = result?.data || result || [];
        setUserResults(users);
        setShowDropdown(true);
      } catch {
        setUserResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  const handleSelectUser = (user) => {
    const userId = user.user_id || user.id;
    setSearch("");
    setShowDropdown(false);
    router.push(`/profile/${userId}`);
  };

  const handleLogout = () => {
    logout();
    router.push("/signin");
  };

  const sidebarUser = profile
    ? {
        name: profile.username || "Utilisateur",
        tag: profile.username?.toLowerCase().replace(/\s+/g, "_") || "user",
        profile: "https://i.pravatar.cc/100?img=12",
        userId: profile.user_id || null,
      }
    : null;

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

            <h1 className="text-2xl font-semibold text-gray-900">Explorer</h1>

            {/* Barre de recherche avec dropdown */}
            <div className="relative">
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-green-400 transition-colors">
                <Search size={16} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => userResults.length > 0 && setShowDropdown(true)}
                  placeholder="Rechercher un utilisateur..."
                  className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
                />
                {search && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setShowDropdown(false);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Dropdown résultats */}
              {showDropdown && (
                <div className="flex flex-col gap-4 p-4 absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  {searchLoading ? (
                    <p className="text-sm text-gray-400 px-4 py-3">
                      Recherche...
                    </p>
                  ) : userResults.length === 0 ? (
                    <p className="text-sm text-gray-400 px-4 py-3">
                      Aucun utilisateur trouvé
                    </p>
                  ) : (
                    userResults.map((user) => {
                      const userId = user.user_id || user.id;
                      const username = user.username || user.name || "Utilisateur";
                      const tag = username.toLowerCase().replace(/\s+/g, "_");

                      return (
                        <button
                          key={userId}
                          onClick={() => handleSelectUser(user)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-500 flex-shrink-0">
                            {username[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {username}
                            </p>
                            <p className="text-xs text-gray-400">@{tag}</p>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Posts */}
            <p className="text-sm text-gray-400 -mt-2">
              {posts.length} breeze{posts.length !== 1 ? "s" : ""} en circulation
            </p>

            <section className="flex flex-col gap-4">
              {error ? (
                <p className="text-red-400 text-sm">{error}</p>
              ) : posts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 font-medium">
                    Aucune breeze pour le moment
                  </p>
                </div>
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