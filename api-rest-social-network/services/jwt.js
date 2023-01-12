const jwt = require("jwt-simple");
const moment = require("moment");
const STRING_CONSTANTS = require("../consts/stringConsts");

exports.createToken = (user) => {
  const payload = {
    id: user._id,
    name: user.name,
    surname: user.name,
    nick: user.nick,
    email: user.email,
    role: user.role,
    image: user.image,
    iat: moment().unix(),
    exp: moment().add(30, "days").unix(),
  };

  return jwt.encode(payload, STRING_CONSTANTS.TOKEN_SECRET);
};
