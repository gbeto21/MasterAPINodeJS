const { Router } = require("express");
const router = Router();
const ArticleController = require("../controllers/Article");

router.get("/", ArticleController.testing);
router.post("/", ArticleController.create);

module.exports = router;
