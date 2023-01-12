const fs = require("fs");
const path = require("path");
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

const upload = (req, res) => {
  let message;
  try {
    const { file } = req;
    if (!file) {
      return res.status(401).json({ message: "Invalid data." });
    }
    let fileName = file.originalname;
    let fileExtension = fileName.split(".")[1];
    if (
      fileExtension != "png" &&
      fileExtension != "jpg" &&
      fileExtension != "jpeg" &&
      fileExtension != "gif"
    ) {
      fs.unlink(file.path, (error) => {
        message = "Invalid file format";
        return res.status(400).json({
          message,
        });
      });
    } else {
      let id = req.params.id;
      Article.findOneAndUpdate(
        { _id: id },
        { image: file.filename },
        { new: true },
        (error, updatedArticle) => {
          if (error) {
            message = "Error updating the file article.";
            console.error(message, error);
            return res.status(500).json({ message });
          }
          message = "Article edited successfully.";
          return res.status(203).send({ message, updatedArticle });
        }
      );
    }
  } catch (error) {
    message = "General error uploading the file.";
    console.error(message, error);
    return res.status(500).json({ message });
  }
};

const getImage = (req, res) => {
  let message;
  try {
    const file = req.params.file;
    const pathFile = `./images/articles/${file}`;

    fs.stat(pathFile, (error, exist) => {
      if (exist) {
        return res.sendFile(path.resolve(pathFile));
      } else {
        message = "Image not founded.";
        return res.status(404).json({ message });
      }
    });
  } catch (error) {
    message = "General error getting the image.";
    console.error(message, error);
    return res.status(500).json({ message });
  }
};

const search = (req, res) => {
  let message;
  try {
    const { query } = req.params;

    Article.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    })
      .sort({ date: -1 })
      .exec((error, articles) => {
        if (error) {
          message = "Error searching the articles.";
          console.error(message, error);
          return res.status(500).json({ message });
        }

        return res.status(201).json({ articles });
      });
  } catch (error) {
    message = "General error searching the articles.";
    console.error(message, error);
    return res.status(500).json({ message });
  }
};

module.exports = {
  testing,
  create,
  getArticles,
  getArticle,
  getImage,
  deleteArticle,
  edit,
  upload,
  search,
};
