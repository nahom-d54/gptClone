const httpStatus = require("http-status");
const APIError = require("../errors/apiError");

const { errorMessages } = require("../utils/constants");
const { DateFuncs } = require("../utils/helperFunctions");
const { default: rateLimit } = require("express-rate-limit");
const passport = require("passport");

const checkIfAuthenticated = async (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) next(err);
    req.user = user;
    next();
  })(req, res, next);
};

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  limit: async (req) => {
    if (req.user) {
      return 500;
    }
    return 50;
  }, // Limit each IP to 50 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: true, // Disable the `X-RateLimit-*` headers.
  skipFailedRequests: true, // Do not count failed requests (status >= 400).
  message: { error: "Too many requests, please try again later." },
  keyGenerator: (req) => {
    if (req.user) return req.user._id;
    return req.ip;
  }, // Custom key generator
  // store: ... , // Redis, Memcached, etc. See below.
});

const checkIfAdmin = async (req, res, next) => {
  if (!req.user?.isAdmin) {
    throw new APIError(
      errorMessages.notAuthorizedForAction,
      httpStatus.FORBIDDEN,
      false
    );
  }
  next();
};

module.exports = {
  checkIfAdmin,

  checkIfAuthenticated,
};
