const { Like } = require("../models");

async function likePost(postId, userId) {
  if (!postId) {
    throw new Error("Post id is required");
  }

  if (!userId) {
    throw new Error("User id is required");
  }

  const existing = await Like.findOne({
    post_id: postId,
    user_id: userId,
  });

  if (existing) {
    return existing;
  }

  return await Like.create({
    post_id: postId,
    user_id: userId,
    comment_id: null,
  });
}

module.exports = {
  likePost,
};
