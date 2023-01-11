const { Router } = require("express");
const router = Router();
const ArticleController = require("../controllers/Article");

// router.get("/", ArticleController.testing);
router.get("/:lasts?", ArticleController.getArticles);
router.get("/byId/:id", ArticleController.getArticle);
router.post("/", ArticleController.create);
router.put("/:id", ArticleController.edit);
router.delete("/:id", ArticleController.deleteArticle);

module.exports = router;
