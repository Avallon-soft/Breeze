const { Post, Follow } = require("../models");

const POST_LIFETIME_MS = 24 * 60 * 60 * 1000;

async function getFeed(userId) {
  if (!userId) {
    throw new Error("User id is required");
  }

  const follows = await Follow.find({
    follower_id: userId,
  });

  const followingIds = follows.map(follow => follow.following_id);

  return await Post.find({
    user_id: {
      $in: followingIds,
    },
    createdAt: {
      $gt: new Date(Date.now() - POST_LIFETIME_MS),
    },
  }).sort({ createdAt: -1 });
}

module.exports = {
  getFeed,
};
