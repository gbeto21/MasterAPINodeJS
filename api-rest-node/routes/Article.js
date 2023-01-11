const { Router } = require("express");
const router = Router();
const ArticleController = require("../controllers/Article");

// router.get("/", ArticleController.testing);
router.get("/", ArticleController.get);
router.post("/", ArticleController.create);

module.exports = router;
