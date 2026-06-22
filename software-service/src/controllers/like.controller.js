const LikeService = require("../services/like.service");

async function likePost(req, res) {
  try {
    const postId = req.query.breeze_id;

    const like = await LikeService.likePost(postId, req.user.uuid);

    res.status(201).json(like);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}



module.exports = {
  likePost
};
