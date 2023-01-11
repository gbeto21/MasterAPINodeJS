const validator = require("validator");
const Article = require("../models/Article");

const testing = (req, res) => {
  return res.status(200).json({ message: "Testing" });
};

const create = (req, res) => {
  try {
    //Take params from the body.
    const params = req.body;
    console.log("🤼‍♀️ Params: ", params);
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
      return res.status(201).json({ message: "Article saved" });
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

module.exports = {
  testing,
  create,
};
