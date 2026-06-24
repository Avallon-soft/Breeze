const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user.controller");

router.get("/search", UserController.searchUsersByUsername);
router.get("/:userId/profile", UserController.getUserById);
router.get("/:userId/followers", UserController.getFollowers);
router.get("/:userId/following", UserController.getFollowing);
router.get("/:userId", UserController.getUserById);

module.exports = router;
