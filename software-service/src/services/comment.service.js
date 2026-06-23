const { Comment, Like } = require("../models");

async function createComment(postId, content, userId) {
  if (!postId) throw new Error("Post id is required");
  if (!content || content.trim() === "") throw new Error("Comment content is required");
  if (!userId) throw new Error("User id is required");

  return await Comment.create({
    comment_content: content,
    post_id: postId,
    user_id: userId,
    parent_comment_id: null,
  });
}

async function createReply(parentCommentId, content, userId) {
  const parent = await Comment.findOne({ comment_id: parentCommentId });

  if (!parent) throw new Error("Parent comment not found");
  if (!content || content.trim() === "") throw new Error("Reply content is required");
  if (!userId) throw new Error("User id is required");

  return await Comment.create({
    comment_content: content,
    post_id: parent.post_id,
    user_id: userId,
    parent_comment_id: parentCommentId,
  });
}

async function deleteComment(commentId) {
  const comment = await Comment.findOneAndDelete({ comment_id: commentId });

  if (!comment) throw new Error("Comment not found");

  await Comment.deleteMany({ parent_comment_id: commentId });
  await Like.deleteMany({ comment_id: commentId });
}

async function deleteReplies(commentId) {
  await Comment.deleteMany({ parent_comment_id: commentId });
}

async function getComment(commentId) {
  const comment = await Comment.findOne({ comment_id: commentId });

  if (!comment) throw new Error("Comment not found");

  const replies = await Comment.find({ parent_comment_id: commentId }).sort({ createdAt: 1 });

  return { ...comment.toObject(), replies };
}

async function getReplies(commentId) {
  return await Comment.find({ parent_comment_id: commentId }).sort({ createdAt: 1 });
}

async function getCommentLikes(commentId) {
  return await Like.find({ comment_id: commentId });
}

module.exports = {
  createComment,
  createReply,
  deleteComment,
  deleteReplies,
  getComment,
  getReplies,
  getCommentLikes,
};