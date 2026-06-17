const express = require("express");
const router = express.Router();

const PostController = require("../controllers/post.controller");

router.post("/", PostController.createPost);
router.get("/", PostController.getAllPosts);
router.get("/:id", PostController.getPostById);
router.put("/:id", PostController.updatePost);
router.delete("/:id", PostController.deletePost);
router.get("/:postId/comments", PostController.getPostComments);
router.get("/:postId/likes", PostController.getPostLikes);

module.exports = router;
