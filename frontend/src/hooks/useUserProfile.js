import { useEffect, useState } from "react";
import meService from "@/core/services/me.service";
import postService from "@/core/services/post.service";
import userService from "@/core/services/user.service";

export function useUserProfile(userId) {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch profile
        const profileData = await meService.getProfileById(userId);
        setProfile(profileData);

        if (profileData?.user_id) {
          // Fetch user's posts
          const allPosts = await postService.getAll();
          const userPosts = allPosts.filter((p) => p.user_id === profileData.user_id);
          setPosts(userPosts);

          // Fetch followers/following
          const [followersData, followingData] = await Promise.all([
            userService.getFollowers(profileData.user_id),
            userService.getFollowing(profileData.user_id),
          ]);

          setFollowers(followersData);
          setFollowing(followingData);
        }
      } catch (err) {
        setError(err.message || "Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  return {
    profile,
    posts,
    followers,
    following,
    loading,
    error,
    stats: {
      postsCount: posts.length,
      followersCount: followers.length,
      followingCount: following.length,
    },
  };
}
