const { Follow } = require("../models");

async function followUser(followerId, followingId) {
  if (!followerId) {
    throw new Error("Follower id is required");
  }

  if (!followingId) {
    throw new Error("Following id is required");
  }

  if (followerId === followingId) {
    throw new Error("You cannot follow yourself");
  }

  const existing = await Follow.findOne({
    follower_id: followerId,
    following_id: followingId,
  });

  if (existing) {
    return existing;
  }

  return await Follow.create({
    follower_id: followerId,
    following_id: followingId,
  });
}

module.exports = {
  followUser,
};
