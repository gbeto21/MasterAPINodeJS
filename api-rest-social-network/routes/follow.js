const express = require("express");
const router = express.Router();
const AuthMiddleware = require("../middlewares/auth");
const FollowController = require("../controllers/follow");

router.post("/", AuthMiddleware.auth, FollowController.follow);

module.exports = router;
