export function getAuthor(post) {
  const author = post.user || post.author || post.name || post.owner || {};
  const userId = post.user_id || author.user_id || "";

  const username = author.username || author.name || post.username || userId || "Utilisateur";
  const tag =
    author.tag ||
    post.tag ||
    (userId ? `user-${String(userId).slice(0, 8)}` : "user");
  const profile = author.profile || author.avatar || author.image || post.profile || null;

  return {
    username,
    tag,
    profile,
  };
}

export function getCountValue(value) {
  if (Array.isArray(value)) {
    return value.length;
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
    return Number(value);
  }

  return 0;
}

export function extractPostFields(post) {
  return {
    content: post.post_content || post.content || "",
    image: post.image || post.media?.image || post.mediaUrl || null,
    link: post.link || post.preview || null,
    createdAt: post.createdAt || post.created_at,
    expiresAt: post.expiresAt || post.expireAt || post.expires_at,
  };
}
