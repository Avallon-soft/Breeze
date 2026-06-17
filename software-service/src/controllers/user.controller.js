const UserService = require("../services/user.service");

async function getFollowers(req, res) {
  try {
    const followers = await UserService.getFollowers(req.params.userId);
    res.status(200).json(followers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getFollowing(req, res) {
  try {
    const following = await UserService.getFollowing(req.params.userId);
    res.status(200).json(following);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getFollowers,
  getFollowing
};
