const PostService = require("../services/post.service");

async function createPost(req, res) {
  try {
    const { content } = req.body;
    const post = await PostService.createPost(content, req.user.uuid);
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function getAllPosts(req, res) {
  try {
    const posts = await PostService.getAllPosts();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getPostById(req, res) {
  try {
    const post = await PostService.getPostById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

async function updatePost(req, res) {
  try {
    const post = await PostService.updatePost(req.params.id, req.body.content);
    res.status(200).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function deletePost(req, res) {
  try {
    await PostService.deletePost(req.params.id);
    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

async function getPostComments(req, res) {
  try {
    const comments = await PostService.getPostComments(req.params.postId);
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getPostLikes(req, res) {
  try {
    const likes = await PostService.getPostLikes(req.params.postId);
    res.status(200).json(likes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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
