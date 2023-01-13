const User = require("../models/user");
const bcrypt = require("bcrypt");
const STRING_CONSTANTS = require("../consts/stringConsts");
const jwt = require("../services/jwt");
const mongoosePagination = require("mongoose-pagination");
const fs = require("fs");
const path = require("path");

const create = async (req, res) => {
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

    const { password } = params;
    const existedUser = await findUser(params);
    if (existedUser) {
      message = "User already exists.";
      return res.status(401).send({ message });
    }

    const passwordHashed = await bcrypt.hash(password, 10);
    const userToSave = new User({ ...params, password: passwordHashed });
    await userToSave.save();
    message = "User saved.";
    return res.status(201).json({ message });
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

const getUsers = async (req, res) => {
  let message;
  try {
    const page = parseInt(req.params.page || "1");
    const itemsPerPage = 5;

    const users = await User.find().sort("_id").paginate(page, itemsPerPage);
    console.group("🍾 users");
    console.dir(users);
    console.groupEnd();
    return res.status(200).send({ page, itemsPerPage, users });
  } catch (error) {
    message = "General error geting the users.";
    console.error(message, error);
    return res.status(500).send({ message });
  }
};

const update = async (req, res) => {
  let message;
  try {
    let user = req.user;
    let newUserData = req.body;
    delete user.iat;
    delete user.exports;
    delete user.role;
    delete user.image;

    const userDataBase = await findUser(newUserData);
    console.dir(userDataBase);
    if (userDataBase) {
      message = "User already exists.";
      return res.status(401).send({ message });
    }

    const { password } = newUserData;
    if (password) {
      password = await bcrypt.hash(password, 10);
    }

    await User.findOneAndUpdate({ _id: user.id }, newUserData, {
      new: true,
    }).exec();
    message = "User updated.";
    return res.status(201).json({ message });
  } catch (error) {
    message = "General error updating the user.";
    console.error(message, error);
    return res.status(500).send({ message });
  }
};

const findUser = async ({ email, nick }) => {
  const userFinded = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { nick: nick.toLowerCase() }],
  }).exec();
  return userFinded;
};

const uploadAvatar = async (req, res) => {
  let message;
  try {
    const { file } = req;
    const fileAttached = file;
    if (!fileAttached) {
      message = "No attached image founded";
      return res.status(401).json({ message });
    }

    const extentionImage = file.originalname.split(".")[1];
    if (
      extentionImage != "png" &&
      extentionImage != "jpg" &&
      extentionImage != "jpeg" &&
      extentionImage != "gif"
    ) {
      fs.unlinkSync(file.path);
      message = "Invalid extension.";
      return res.status(403).send({ message });
    }

    await User.findOneAndUpdate(
      { _id: req.user.id },
      { image: file.filename }
    ).exec();
    message = "Avatar uploaded.";
    return res.status(201).json({ message });
  } catch (error) {
    message = "General error uploading the avatar.";
    console.error(message, error);
    return res.status(500).send({ message });
  }
};

const getAvatar = (req, res) => {
  let message;
  try {
    const avatarParam = req.params.avatar;
    const avatarPath = `./uploads/avatars/${avatarParam}`;
    fs.stat(avatarPath, (error, exists) => {
      if (!exists) {
        message = "No avatar founded.";
        return res.status(400).send({ message });
      }

      return res.status(200).sendFile(path.resolve(avatarPath));
    });
  } catch (error) {
    message = "General error getting the avatar.";
    console.error(message, error);
    return res.status(500).send({ message });
  }
};

module.exports = {
  create,
  login,
  getProfile,
  getUsers,
  update,
  uploadAvatar,
  getAvatar,
};
