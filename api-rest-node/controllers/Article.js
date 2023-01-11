const validator = require("validator");
const Article = require("../models/Article");

const testing = (req, res) => {
  return res.status(200).json({ message: "Testing" });
};

const create = (req, res) => {
  try {
    //Take params from the body.
    const params = req.body;
    const { title = "", content = "" } = params;

    //Validate data.
    const titleCorrect =
      !validator.isEmpty(title) &&
      validator.isLength(title, { min: 5, max: 25 });
    const contentCorrect = !validator.isEmpty(content || "");
    if (!titleCorrect || !contentCorrect) {
      return res.status(400).json({ message: "Invalid input data." });
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
      article: articleSaved,
    });
  }
};

const get = (req, res) => {
  try {
    const query = Article.find({}).exec((error, articles) => {
      if (error) {
        return res.status(500).json({ message: "Error saving the article" });
      }
      return res.status(201).send({ articles });
    });
  } catch (error) {
    console.error("Error getting the articles: ", error);
  }
};

module.exports = {
  testing,
  create,
  get,
};
