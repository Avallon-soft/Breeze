const FeedService = require("../services/feed.service");

async function getFeed(req, res) {
  try {
    const feed = await FeedService.getFeed(req.user.uuid);

    res.status(200).json(feed);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = {
  getFeed
};
