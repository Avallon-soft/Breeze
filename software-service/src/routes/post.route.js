const express = require("express");

const router = express.Router();

const AuthController = require("../controllers/post.controller");
const {authenticate} = require("../middleware/post.middleware");

router.post("/register",  AuthController.register);

router.post("/login",  AuthController.login);

router.get("/validate", authenticate, AuthController.validate);

module.exports = router;