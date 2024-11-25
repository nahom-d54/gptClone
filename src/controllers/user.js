const httpStatus = require("http-status");
const User = require("../models/User");
const { errorMessages } = require("../utils/constants");
const APIError = require("../errors/apiError");
const authenticate = async (req, res) => {
  const { email, password } = req.body;

  const auth = await User.authenticate(email, password);
  if (!auth) {
    throw new APIError(
      errorMessages.invalidEmailOrPassword,
      httpStatus.UNAUTHORIZED,
      true
    );
  }
  res.json(auth);
};
const register = async (req, res) => {
  const createUser = await User.createUser(req.body);
  if (!createUser) {
    throw new APIError(
      errorMessages.userRegistrationFailed,
      httpStatus.BAD_REQUEST,
      true
    );
  }
  res.status(httpStatus.CREATED).json(createUser);
};

const verifyUser = async (req, res) => {
  const { token } = req.params;
  const email = req.query.email;

  const user = await User.verifyUser(token, email);
  res.json(user);
};

const resendVerificationEmail = async (req, res) => {
  const { email } = req.query;
  const user = await User.resendVerificationEmail(email);
  res.json(user);
};

module.exports = {
  authenticate,
  register,
  verifyUser,
  resendVerificationEmail,
};
