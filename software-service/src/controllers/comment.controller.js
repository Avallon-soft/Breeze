const CommentService = require("../services/comment.service");

async function createComment(req, res) {
  try {
    const postId = req.query.breeze_id;
    const { content, user_id } = req.body;

    const comment = await CommentService.createComment(postId, content, user_id);

    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function deleteComment(req, res) {
  try {
    await CommentService.deleteComment(req.params.commentId);
    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

async function createReply(req, res) {
  try {
    const { content, user_id, post_id } = req.body;

    const reply = await CommentService.createReply(
      req.params.commentId,
      post_id,
      content,
      user_id
    );

    res.status(201).json(reply);
  } catch (err) {
    res.status(400).json({ message: err.message });
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

async function deleteReplies(req, res) {
  try {
    await CommentService.deleteReplies(req.params.commentId);
    res.status(200).json({ message: "Replies deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function likeComment(req, res) {
  try {
    const { user_id } = req.body;

    const like = await CommentService.likeComment(
      req.params.commentId,
      user_id
    );

    res.status(201).json(like);
  } catch (err) {
    res.status(400).json({ message: err.message });
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

module.exports = {
  createComment,
  deleteComment,
  createReply,
  getReplies,
  deleteReplies,
  likeComment,
  getCommentLikes
};
