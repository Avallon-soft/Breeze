const express = require("express");
const router = express.Router();

const CommentController = require("../controllers/comment.controller");

router.post("/", CommentController.createComment);
router.delete("/:commentId", CommentController.deleteComment);

router.post("/:commentId/replies", CommentController.createReply);
router.get("/:commentId/replies", CommentController.getReplies);
router.delete("/:commentId/replies", CommentController.deleteReplies);

router.post("/:commentId/like", CommentController.likeComment);
router.get("/:commentId/likes", CommentController.getCommentLikes);

module.exports = router;
