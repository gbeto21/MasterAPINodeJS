const express = require("express");
const router = express.Router();
const multer = require("multer");
const UserController = require("../controllers/user");
const AuthMiddleware = require("../middlewares/auth");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/avatars");
  },
  filename: (req, file, cb) => {
    cb(null, `avatar-${Date.now()}-${file.originalname}`);
  },
});

const uploads = multer({ storage });

router.post("/", UserController.create);
router.post("/login", UserController.login);
router.get("/profile/:id", AuthMiddleware.auth, UserController.getProfile);
router.get("/:page?", AuthMiddleware.auth, UserController.getUsers);
router.put("/", AuthMiddleware.auth, UserController.update);
router.post(
  "/avatar",
  [AuthMiddleware.auth, uploads.single("avatar")],
  UserController.uploadAvatar
);

module.exports = router;
