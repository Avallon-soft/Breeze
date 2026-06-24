const { Post, Follow } = require("../models");

async function getFeed(userId) {
  if (!userId) {
    throw new Error("User id is required");
  }

  const follows = await Follow.find({
    follower_id: userId,
  });

  const followingIds = follows.map(
    (follow) => follow.following_id
  );

  return Post.find({
    user_id: {
      $in: followingIds,
    },

    expiresAt: {
      $gt: new Date(),
    },
  }).sort({
    createdAt: -1,
  });
}

module.exports = {
  getFeed,
};