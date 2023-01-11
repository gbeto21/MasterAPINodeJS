const { Router } = require("express");
const router = Router();
const ArticleController = require("../controllers/Article");

router.get("/articles", ArticleController.testing);

module.exports = router;
