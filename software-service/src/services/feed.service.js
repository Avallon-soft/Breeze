const { Op } = require("sequelize");
const { Post, Follow } = require("../models");

async function getFeed(userId) {
  if (!userId) {
    throw new Error("User id is required");
  }

  const follows = await Follow.findAll({
    where: {
      follower_id: userId
    }
  });

  const followingIds = follows.map(follow => follow.following_id);

  followingIds.push(Number(userId));

  return await Post.findAll({
    where: {
      user_id: {
        [Op.in]: followingIds
      }
    },
    order: [["createdAt", "DESC"]]
  });
}

module.exports = {
  getFeed
};
