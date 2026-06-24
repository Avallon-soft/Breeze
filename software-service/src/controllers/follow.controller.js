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

async function unfollowUser(req, res) {
  try {
    const followingId = req.query.user_id;
    const result = await FollowService.unfollowUser(req.user.uuid, followingId);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function checkFollow(req, res) {
  try {
    const followingId = req.query.user_id;
    const following = await FollowService.isFollowing(req.user.uuid, followingId);
    res.status(200).json({ following });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = {
  followUser, unfollowUser, checkFollow
};
