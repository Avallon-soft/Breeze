const express = require("express");
const router = express.Router();

const FeedController = require("../controllers/feed.controller");

router.get("/", FeedController.getFeed);

module.exports = router;
