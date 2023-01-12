const jwt = require("jwt-simple");
const moment = require("moment");
const libJWT = require("../services/jwt");
const STRING_CONSTS = require("../consts/stringConsts");

exports.auth = (req, res, next) => {
  let message;
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      message = "No auth header founded.";
      return res.status(403).send({ message });
    }
    let token = authorization.replace(/['"]+/g, "");
    let payload = jwt.decode(token, STRING_CONSTS.TOKEN_SECRET);
    if (payload.exp <= moment().unix()) {
      message = "Expired token.";
      return res.status(403).send({ message });
    }

    req.user = payload;
    next();
  } catch (error) {
    message = "General error on auth middleware.";
    return res.status(500).send({ message });
  }
};
