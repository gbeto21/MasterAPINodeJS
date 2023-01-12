const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
const AuthMiddleware = require("../middlewares/auth");

router.post("/", UserController.create);
router.post("/login", UserController.login);

module.exports = router;
