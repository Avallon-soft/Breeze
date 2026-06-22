const FollowService = require("../services/follow.service");

async function followUser(req, res) {
  try {
    const followingId = req.query.user_id;

    const follow = await FollowService.followUser(req.user.uuid, followingId);

    res.status(201).json(follow);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = {
  followUser
};
