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
    user_id: userId
  });
}

async function getAllPosts() {
  return await Post.findAll({
    order: [["createdAt", "DESC"]]
  });
}

async function getPostById(id) {
  const post = await Post.findByPk(id);

  if (!post) {
    throw new Error("Post not found");
  }

  return post;
}

async function updatePost(id, content) {
  const post = await getPostById(id);

  if (!content || content.trim() === "") {
    throw new Error("Post content is required");
  }

  post.post_content = content;
  await post.save();

  return post;
}

async function deletePost(id) {
  const post = await getPostById(id);
  await post.destroy();
}

async function getPostComments(postId) {
  return await Comment.findAll({
    where: {
      post_id: postId,
      parent_comment_id: null
    },
    order: [["createdAt", "ASC"]]
  });
}

async function getPostLikes(postId) {
  return await Like.findAll({
    where: {
      post_id: postId
    }
  });
}

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostComments,
  getPostLikes
};
