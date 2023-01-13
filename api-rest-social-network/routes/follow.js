const express = require("express");
const router = express.Router();
const AuthMiddleware = require("../middlewares/auth");
const FollowController = require("../controllers/follow");

router.post("/", AuthMiddleware.auth, FollowController.follow);
router.delete("/:id", AuthMiddleware.auth, FollowController.unfollow);
router.get(
  "/following/:id?/:page?",
  AuthMiddleware.auth,
  FollowController.getFollowing
);
router.get(
  "/followers/:id?/:page?",
  AuthMiddleware.auth,
  FollowController.getFollowers
);

module.exports = router;
