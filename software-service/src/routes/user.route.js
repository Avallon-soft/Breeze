const express = require("express");

const router = express.Router();

const UserController = require("../controllers/user.controller");
const { authenticate } = require("../middleware/user.middleware");

router.get("/:id",              authenticate, UserController.getUserById);
router.put("/:id",              authenticate, UserController.updateUser);
router.delete("/:id",           authenticate, UserController.deleteUser);
router.put("/:userId/profile",  authenticate, UserController.updateUserProfile);

module.exports = router;
