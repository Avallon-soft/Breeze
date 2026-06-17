const express = require("express");
const router = express.Router();

const MeController = require("../controllers/me.controller");

router.get("/likes", MeController.getMyLikes);

module.exports = router;
