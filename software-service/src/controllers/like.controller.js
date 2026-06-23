const LikeService = require("../services/like.service");

async function like(req, res) {
  try {
    const { post_id, comment_id } = req.query;

    if (!post_id && !comment_id) {
      return res.status(400).json({ message: "post_id or comment_id query param is required" });
    }

    const like = post_id
        ? await LikeService.likePost(post_id, req.user.uuid)
        : await LikeService.likeComment(comment_id, req.user.uuid);

    res.status(201).json(like);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = {
  like,
};