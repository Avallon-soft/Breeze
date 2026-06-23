const { Like } = require("../models");

async function likePost(postId, userId) {
  if (!postId) throw new Error("Post id is required");
  if (!userId) throw new Error("User id is required");

  const existing = await Like.findOne({
    post_id: postId,
    user_id: userId,
  });

  if (existing) {
    await Like.findOneAndDelete({ like_id: existing.like_id });
    return { message: "Like removed", liked: false };
  }

  return await Like.create({
    post_id: postId,
    user_id: userId,
    comment_id: null,
  });
}

async function likeComment(commentId, userId) {
  if (!commentId) throw new Error("Comment id is required");
  if (!userId) throw new Error("User id is required");

  const existing = await Like.findOne({
    comment_id: commentId,
    user_id: userId,
  });

  if (existing) {
    await Like.findOneAndDelete({ like_id: existing.like_id });
    return { message: "Like removed", liked: false };
  }

  return await Like.create({
    comment_id: commentId,
    user_id: userId,
    post_id: null,
  });
}

module.exports = {
  likePost,
  likeComment,
};