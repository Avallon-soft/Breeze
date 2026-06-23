const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user.controller");

router.post("/users/sync", UserController.syncUserFromAuth);

module.exports = router;
