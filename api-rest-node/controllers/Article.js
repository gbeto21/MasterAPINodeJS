const { validateArticle } = require("../helper/validator");
const Article = require("../models/Article");

const testing = (req, res) => {
  return res.status(200).json({ message: "Testing" });
};

const create = (req, res) => {
  try {
    //Take params from the body.
    const params = req.body;

    const articleIsValid = validateArticle(params);
    if (articleIsValid == false) {
      return res.status(401).json({ message: "Invalid data." });
    }

    //Create the object to be saved.
    //Assign value to object based on the model
    const article = new Article(params);

    //Save the article in the database
    article.save((error, articleSaved) => {
      if (error) {
        return res.status(500).json({ message: "Error saving the article" });
      }

      //Return result
      return res
        .status(201)
        .json({ message: "Article saved", article: articleSaved });
    });
  } catch (error) {
    console.error("Error saving the article.");
    console.error(error);
    return res.status(500).json({
      message: "General error creating the article",
    });
  }
};

const getArticles = (req, res) => {
  try {
    const { lasts = 1 } = req.params.lasts;
    const query = Article.find({})
      .sort({ date: -1 })
      .limit(lasts)
      .exec((error, articles) => {
        if (error) {
          const message = "Error getting the articles";
          console.error(message, error);
          return res.status(500).json({ message });
        }
        return res.status(201).send({ articles });
      });
  } catch (error) {
    const message = "General error getting the articles.";
    console.error(message, error);
    return res.status(500).json({ message });
  }
};

const getArticle = (req, res) => {
  try {
    const id = req.params.id;
    Article.findById(id, (error, article) => {
      if (error) {
        const message = "Error getting the articles";
        console.error(message, error);
        return res.status(500).json({ message });
      }
      return res.status(201).send({ article });
    });
  } catch (error) {
    const message = "General error getting the article.";
    console.error(message, error);
    return res.status(500).json({ message });
  }
};

const deleteArticle = (req, res) => {
  let message;
  try {
    const id = req.params.id;
    Article.findOneAndDelete({ _id: id }, (error, deletedArticle) => {
      if (error) {
        message = "Error getting the articles.";
        console.error(message, error);
        return res.status(500).json({ message });
      }
      message = "Article deleted successfully.";
      return res.status(203).send({ message });
    });
  } catch (error) {
    message = "General error deleting the article.";
    console.error(message, error);
    return res.status(500).json({ message });
  }
};

const edit = (req, res) => {
  let message;
  try {
    const id = req.params.id;
    const params = req.body;
    const articleIsValid = validateArticle(params);
    if (articleIsValid == false) {
      return res.status(401).json({ message: "Invalid data." });
    }

    Article.findOneAndUpdate({ _id: id }, params, (error, updatedArticle) => {
      if (error) {
        message = "Error editing the article.";
        console.error(message, error);
        return res.status(500).json({ message });
      }
      message = "Article edited successfully.";
      return res.status(203).send({ message });
    });
  } catch (error) {
    message = "General error deleting the article.";
    console.error(message, error);
    return res.status(500).json({ message });
  }
};

module.exports = {
  testing,
  create,
  getArticles,
  getArticle,
  deleteArticle,
  edit,
};
