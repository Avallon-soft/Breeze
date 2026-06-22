const { Follow } = require("../models");

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
  getFollowers,
  getFollowing,
};
