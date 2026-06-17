const FeedService = require("../services/feed.service");

async function getFeed(req, res) {
  try {
    const userId = req.query.user_id;

    const feed = await FeedService.getFeed(userId);

    res.status(200).json(feed);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = {
  getFeed
};
