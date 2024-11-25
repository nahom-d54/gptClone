const httpStatus = require("http-status");
const APIError = require("../errors/apiError");
const Subscriptions = require("../models/Subscriptions");
const { errorMessages } = require("../utils/constants");
const { DateFuncs } = require("../utils/helperFunctions");
const { default: rateLimit } = require("express-rate-limit");
const passport = require("passport");
const { default: RedisStore } = require("rate-limit-redis");
const client = require("../config/redis");

const checkSubscription = async (req, res, next) => {
  const userSubscription = await Subscriptions.getSubscription(req?.user?._id);

  req.userSubscription = userSubscription;

  if (!userSubscription || !userSubscription.active) {
    throw new APIError(
      errorMessages.userSubscriptionNotFoundOrActive,
      httpStatus.FAILED_DEPENDENCY,
      false
    );
  }
  if (!userSubscription.subscriptionType) {
    throw new APIError(
      errorMessages.userSubscriptionTypeNotFound,
      httpStatus.FAILED_DEPENDENCY,
      false
    );
  }
  if (userSubscription.endDate < Date.now()) {
    throw new APIError(
      errorMessages.userSubscriptionExpired,
      httpStatus.FAILED_DEPENDENCY,
      false
    );
  }
  if (userSubscription.quotaResetDate < Date.now()) {
    userSubscription.usedQuota = 0;
    userSubscription.quotaResetDate = DateFuncs.timedelta(
      userSubscription.startDate,
      {
        days: userSubscription.subscriptionType.quotaResetPeriod,
        months: Date.now().getMonth() - userSubscription.startDate.getMonth(),
        years:
          Date.now().getFullYear() - userSubscription.startDate.getFullYear(),
      }
    );
    await userSubscription.save();
  }
  const userquota = userSubscription.subscriptionType.quota;
  if (userSubscription.usedQuota >= userquota) {
    throw new APIError(
      errorMessages.userSubscriptionQuotaExceeded,
      httpStatus.BAD_REQUEST,
      false
    );
  }

  const now = Date.now();

  userSubscription.usedQuota = userSubscription.usedQuota + 1;
  userSubscription.lastUsed = now;
  await userSubscription.save();
  next();
};

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
  checkSubscription,
  checkIfAdmin,
  limiter,
  checkIfAuthenticated,
};
