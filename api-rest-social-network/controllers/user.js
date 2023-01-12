const User = require("../models/user");
const bcrypt = require("bcrypt");

const create = (req, res) => {
  let message;
  try {
    const params = req.body;
    const paramsValid = validateUserParams(params);
    if (paramsValid == false) {
      message = "Invalid user data.";
      return res.status(400).json({ message });
    }

    const { email, nick, password } = params;

    User.find({
      $or: [{ email: email.toLowerCase() }, { nick: nick.toLowerCase() }],
    }).exec(async (error, users) => {
      if (error) {
        message = "Error validating the user duplicated.";
        console.error(message), error;
        return res.status(500).json({ message });
      }
      const userAlreadyExists = users && users.length > 0;
      if (userAlreadyExists) {
        message = "User already exists.";
        return res.status(401).send({ message });
      }

      const passwordHashed = await bcrypt.hash(password, 10);
      const userToSave = new User({ ...params, password: passwordHashed });
      userToSave.save((error, userSaved) => {
        if (error) {
          message = "Error saving the user.";
          console.error(message, error);
          return res.status(500).send({ message });
        }
        message = "User saved.";
        return res.status(201).json({ message });
      });
    });
  } catch (error) {
    message = "Error creating the user. ";
    console.error(message, error);
  }
};

const validateUserParams = (params) => {
  let paramsAreValid = true;

  return paramsAreValid;
};

module.exports = { create };
