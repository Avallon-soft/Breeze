const express = require("express");
const router = express.Router();

const FollowController = require("../controllers/follow.controller");

router.post("/", FollowController.followUser);

module.exports = router;
