const CommentService = require("../services/comment.service");

async function createComment(req, res) {
  try {
    const { post_id, comment_id } = req.query;
    const { content } = req.body;

    if (!post_id && !comment_id) {
      return res.status(400).json({ message: "post_id or comment_id query param is required" });
    }

    const comment = post_id
        ? await CommentService.createComment(post_id, content, req.user.uuid)
        : await CommentService.createReply(comment_id, content, req.user.uuid);

    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function deleteComment(req, res) {
  try {
    const { commentId } = req.params;
    const repliesOnly = req.query.replies_only === "true";

    if (repliesOnly) {
      await CommentService.deleteReplies(commentId);
      return res.status(200).json({ message: "Replies deleted" });
    }

    await CommentService.deleteComment(commentId);
    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

async function getComment(req, res) {
  try {
    const comment = await CommentService.getComment(req.params.commentId);
    res.status(200).json(comment);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

async function getReplies(req, res) {
  try {
    const replies = await CommentService.getReplies(req.params.commentId);
    res.status(200).json(replies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getCommentLikes(req, res) {
  try {
    const likes = await CommentService.getCommentLikes(req.params.commentId);
    res.status(200).json(likes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function createReply(req, res) {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    const reply = await CommentService.createReply(commentId, content, req.user.uuid);
    res.status(201).json(reply);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = {
  createComment,
  deleteComment,
  getComment,
  getReplies,
  getCommentLikes,
  createReply,
};