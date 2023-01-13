const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
const AuthMiddleware = require("../middlewares/auth");

router.post("/", UserController.create);
router.post("/login", UserController.login);
router.get("/profile/:id", AuthMiddleware.auth, UserController.getProfile);
router.get("/:page?", AuthMiddleware.auth, UserController.getUsers);
router.put("/", AuthMiddleware.auth, UserController.update);

module.exports = router;
