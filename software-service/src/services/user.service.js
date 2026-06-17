const { Follow } = require("../models");

async function getFollowers(userId) {
  return await Follow.findAll({
    where: {
      following_id: userId
    }
  });
}

async function getFollowing(userId) {
  return await Follow.findAll({
    where: {
      follower_id: userId
    }
  });
}

module.exports = {
  getFollowers,
  getFollowing
};
