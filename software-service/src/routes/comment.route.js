const express = require("express");
const router = express.Router();

const CommentController = require("../controllers/comment.controller");

router.post("/", CommentController.createComment);
router.delete("/:commentId", CommentController.deleteComment);

router.get("/:commentId", CommentController.getComment);
router.get("/:commentId/replies", CommentController.getReplies);

router.get("/:commentId/likes", CommentController.getCommentLikes);
router.post("/:commentId/replies", CommentController.createReply);

module.exports = router;