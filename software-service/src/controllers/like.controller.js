const LikeService = require("../services/like.service");

async function likePost(req, res) {
  try {
    const postId = req.query.breeze_id;
    const { user_id } = req.body;

    const like = await LikeService.likePost(postId, user_id);

    res.status(201).json(like);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = {
  likePost
};
