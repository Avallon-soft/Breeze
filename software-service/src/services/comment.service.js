const { Comment, Like } = require("../models");

async function createComment(postId, content, userId) {
  if (!postId) {
    throw new Error("Post id is required");
  }

  if (!content || content.trim() === "") {
    throw new Error("Comment content is required");
  }

  if (!userId) {
    throw new Error("User id is required");
  }

  return await Comment.create({
    comment_content: content,
    post_id: postId,
    user_id: userId,
    parent_comment_id: null
  });
}

async function deleteComment(commentId) {
  const comment = await Comment.findByPk(commentId);

  if (!comment) {
    throw new Error("Comment not found");
  }

  await comment.destroy();
}

async function createReply(parentCommentId, postId, content, userId) {
  if (!parentCommentId) {
    throw new Error("Parent comment id is required");
  }

  if (!postId) {
    throw new Error("Post id is required");
  }

  if (!content || content.trim() === "") {
    throw new Error("Reply content is required");
  }

  if (!userId) {
    throw new Error("User id is required");
  }

  return await Comment.create({
    comment_content: content,
    post_id: postId,
    user_id: userId,
    parent_comment_id: parentCommentId
  });
}

async function getReplies(commentId) {
  return await Comment.findAll({
    where: {
      parent_comment_id: commentId
    },
    order: [["createdAt", "ASC"]]
  });
}

async function deleteReplies(commentId) {
  await Comment.destroy({
    where: {
      parent_comment_id: commentId
    }
  });
}

async function likeComment(commentId, userId) {
  if (!userId) {
    throw new Error("User id is required");
  }

  const existing = await Like.findOne({
    where: {
      comment_id: commentId,
      user_id: userId
    }
  });

  if (existing) {
    return existing;
  }

  return await Like.create({
    comment_id: commentId,
    user_id: userId,
    post_id: null
  });
}

async function getCommentLikes(commentId) {
  return await Like.findAll({
    where: {
      comment_id: commentId
    }
  });
}

module.exports = {
  createComment,
  deleteComment,
  createReply,
  getReplies,
  deleteReplies,
  likeComment,
  getCommentLikes
};
