const User = require("../models/user");
const bcrypt = require("bcrypt");
const STRING_CONSTANTS = require("../consts/stringConsts");
const jwt = require("../services/jwt");

const create = (req, res) => {
  let message;
  try {
    const params = req.body;
    const paramsValid = validateUserProperties(
      params,
      STRING_CONSTANTS.NAME,
      STRING_CONSTANTS.SURNAME,
      STRING_CONSTANTS.NICK,
      STRING_CONSTANTS.EMAIL,
      STRING_CONSTANTS.PASSWORD
    );
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

const login = async (req, res) => {
  let message;
  try {
    const params = req.body;
    const paramsAreValid = validateUserProperties(
      params,
      STRING_CONSTANTS.EMAIL,
      STRING_CONSTANTS.PASSWORD
    );
    if (paramsAreValid == false) {
      message = "Invalid user data.";
      return res.status(400).json({ message });
    }

    const { email, password } = params;
    const userRegistered = await User.findOne({ email }).exec();
    if (!userRegistered) {
      message = "Invalid user data.";
      return res.status(400).json({ message });
    }

    const passwordsMatch = bcrypt.compareSync(
      password,
      userRegistered.password
    );
    if (passwordsMatch == false) {
      message = "Invalid user data.";
      return res.status(400).json({ message });
    }

    const token = jwt.createToken(userRegistered);
    return res.status(201).send({ token });
  } catch (error) {
    message = "General error on login.";
    console.error(message, error);
    return res.status(500).send({ message });
  }
};

const validateUserProperties = (params, ...properties) => {
  let paramsAreValid = true;

  properties.every((property) => {
    const valueProperty = params[property];
    if (!valueProperty) {
      paramsAreValid = false;
    }
    return valueProperty;
  });

  return paramsAreValid;
};

const getProfile = async (req, res) => {
  let message;
  try {
    const id = req.params.id;
    const user = await User.findById(id)
      .select({ password: 0, role: 0 })
      .exec();
    if (!user) {
      message = "No user founded getting the profile.";
      console.error(message, error);
      return res.status(500).send({ message });
    }
    return res.status(201).send({ user });
  } catch (error) {
    message = "General error geting the profile.";
    console.error(message, error);
    return res.status(500).send({ message });
  }
};

module.exports = { create, login, getProfile };
