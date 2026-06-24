const { Like, User } = require("../models");

async function getMyLikes(userId) {
  if (!userId) {
    throw new Error("User id is required");
  }

  return await Like.find({
    user_id: userId,
  });
}

async function getMyProfile(userId) {
  const profile = await User.findOne({ user_id: userId });

  if (!profile) {
    throw new Error("Profile not found");
  }

  return profile;
}

async function upsertMyProfile(userId, { username, bio, avatar, banner } = {}) {
  if (!userId) {
    throw new Error("User id is required");
  }

  if (!username || username.trim() === "") {
    throw new Error("Username is required");
  }

  return await User.findOneAndUpdate(
    { user_id: userId },
    {
      user_id: userId,
      username: username.trim(),
      ...(bio !== undefined && { bio: bio?.trim() ?? "" }),
      ...(avatar !== undefined && { avatar }),
      ...(banner !== undefined && { banner }),
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );
}

module.exports = {
  getMyLikes,
  getMyProfile,
  upsertMyProfile,
};
