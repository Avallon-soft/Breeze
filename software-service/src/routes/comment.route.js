const express = require("express");
const router = express.Router();

const CommentController = require("../controllers/comment.controller");

router.post("/", CommentController.createComment);
router.delete("/:commentId", CommentController.deleteComment);

router.get("/:commentId", CommentController.getComment);
router.get("/:commentId/replies", CommentController.getReplies);

router.get("/:commentId/likes", CommentController.getCommentLikes);

module.exports = router;