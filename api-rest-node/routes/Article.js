const { Router } = require("express");
const multer = require("multer");
const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images/articles/");
  },
  filename: (req, file, cb) => {
    cb(null, `article-${Date.now()}-${file.originalname}`);
  },
});

const uploads = multer({ storage });

const ArticleController = require("../controllers/Article");

// router.get("/", ArticleController.testing);
router.get("/:lasts?", ArticleController.getArticles);
router.get("/byId/:id", ArticleController.getArticle);
router.get("/image/:file", ArticleController.getImage);
router.post("/", ArticleController.create);
router.post("/upload/:id", [uploads.single("file")], ArticleController.upload);
router.put("/:id", ArticleController.edit);
router.delete("/:id", ArticleController.deleteArticle);

module.exports = router;
