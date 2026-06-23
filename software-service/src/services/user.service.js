const { Follow, User } = require("../models");

function buildDefaultUsername(email, userId) {
  const emailName = email ? email.split("@")[0] : "user";
  const base = emailName
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 32) || "user";

  return `${base}_${userId.slice(0, 8)}`;
}

async function syncUserFromAuth(userId, email) {
  if (!userId) {
    throw new Error("User id is required");
  }

  const existingUser = await User.findOne({ user_id: userId });

  if (existingUser) {
    return existingUser;
  }

  return await User.create({
    user_id: userId,
    username: buildDefaultUsername(email, userId),
  });
}

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
  syncUserFromAuth,
  getUserById,
  getFollowers,
  getFollowing,
};
