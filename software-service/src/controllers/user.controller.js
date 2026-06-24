const UserService = require("../services/user.service");

async function syncUserFromAuth(req, res) {
  try {
    const { uuid, email } = req.body;
    const user = await UserService.syncUserFromAuth(uuid, email);

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function getUserById(req, res) {
  try {
    const user = await UserService.getUserById(req.params.userId);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

async function searchUsersByUsername(req, res) {
  try {
    const users = await UserService.searchUsersByUsername(req.query.username);
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

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
  syncUserFromAuth,
  getUserById,
  searchUsersByUsername,
  getFollowers,
  getFollowing
};
