const { Post, Comment, Like } = require("../models");

async function createPost(content, userId) {
  if (!content || content.trim() === "") {
    throw new Error("Post content is required");
  }

  if (!userId) {
    throw new Error("User id is required");
  }

  return await Post.create({
    post_content: content,
    user_id: userId,
  });
}

async function getAllPosts() {
  return await Post.find().sort({ createdAt: -1 });
}

async function getPostById(id) {
  const post = await Post.findOne({ post_id: id });

  if (!post) {
    throw new Error("Post not found");
  }

  return post;
}

async function updatePost(id, content) {
  if (!content || content.trim() === "") {
    throw new Error("Post content is required");
  }

  const post = await Post.findOneAndUpdate(
    { post_id: id },
    { post_content: content },
    { new: true }
  );

  if (!post) {
    throw new Error("Post not found");
  }

  return post;
}

async function deletePost(id) {
  const post = await Post.findOneAndDelete({ post_id: id });

  if (!post) {
    throw new Error("Post not found");
  }

  await Comment.deleteMany({ post_id: id });
  await Like.deleteMany({ post_id: id });
}

async function getPostComments(postId) {
  return await Comment.find({
    post_id: postId,
    parent_comment_id: null,
  }).sort({ createdAt: 1 });
}

async function getPostLikes(postId) {
  return await Like.find({
    post_id: postId,
  });
}

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostComments,
  getPostLikes,
};
