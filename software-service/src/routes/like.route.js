const express = require("express");
const router = express.Router();

const LikeController = require("../controllers/like.controller");

router.post("/", LikeController.like);

module.exports = router;
