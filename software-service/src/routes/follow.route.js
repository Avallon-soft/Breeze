const express = require("express");
const router = express.Router();

const FollowController = require("../controllers/follow.controller");

router.post("/", FollowController.followUser);
router.delete("/", FollowController.unfollowUser);
router.get("/check", FollowController.checkFollow);

module.exports = router;
