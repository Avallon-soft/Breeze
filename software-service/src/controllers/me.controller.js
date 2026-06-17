const MeService = require("../services/me.service");

async function getMyLikes(req, res) {
  try {
    const userId = req.query.user_id;

    const likes = await MeService.getMyLikes(userId);

    res.status(200).json(likes);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = {
  getMyLikes
};
