const { Router } = require("express");
const router = Router();
const ArticleController = require("../controllers/Article");

// router.get("/", ArticleController.testing);
router.get("/:lasts?", ArticleController.getArticles);
router.get("/byId/:id", ArticleController.getArticle);
router.post("/", ArticleController.create);

module.exports = router;
