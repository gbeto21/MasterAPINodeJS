const validator = require("validator");

const validateArticle = (params) => {
  let articleIsValid = false;
  const { title = "", content = "" } = params;

  //Validate data.
  const titleCorrect =
    !validator.isEmpty(title) && validator.isLength(title, { min: 5, max: 25 });
  const contentCorrect = !validator.isEmpty(content || "");
  if (titleCorrect && contentCorrect) {
    articleIsValid = true;
  }
  return articleIsValid;
};

module.exports = {
  validateArticle,
};
