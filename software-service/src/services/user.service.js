const { Follow, User } = require("../models");

async function getUserById(userId) {
  const user = await User.findOne({ user_id: userId });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

async function getFollowers(userId) {
  return await Follow.find({
    following_id: userId,
  });
}

async function getFollowing(userId) {
  return await Follow.find({
    follower_id: userId,
  });
}

module.exports = {
  getUserById,
  getFollowers,
  getFollowing,
};
