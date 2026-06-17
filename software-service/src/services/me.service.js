const { Like } = require("../models");

async function getMyLikes(userId) {
  if (!userId) {
    throw new Error("User id is required");
  }

  return await Like.findAll({
    where: {
      user_id: userId
    }
  });
}

module.exports = {
  getMyLikes
};
