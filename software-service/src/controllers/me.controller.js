const MeService = require("../services/me.service");

async function getMyLikes(req, res) {
  try {
    const likes = await MeService.getMyLikes(req.user.uuid);
    res.status(200).json(likes);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function getMyProfile(req, res) {
  try {
    const profile = await MeService.getMyProfile(req.user.uuid);
    res.status(200).json(profile);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

async function upsertMyProfile(req, res) {
  try {
    const profile = await MeService.upsertMyProfile(req.user.uuid, req.body.username);
    res.status(200).json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = {
  getMyLikes,
  getMyProfile,
  upsertMyProfile
};
