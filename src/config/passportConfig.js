const passport = require("passport");
const { ExtractJwt, Strategy: JwtStrategy } = require("passport-jwt");
const User = require("../models/User");
const httpStatus = require("http-status");
const APIError = require("../errors/apiError");
const { errorMessages } = require("../utils/constants");

// JWT strategy configuration
const secret = process.env.JWT_SECRET;
const initiatePassport = () =>
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: secret,
      },
      async (jwtPayload, done) => {
        try {
          const user = await User.findById(jwtPayload._id);
          if (!user) {
            return done(null, false, { message: "User not found" });
          }
          done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );

// Middleware to verify JWT
const authenticateJWT = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      throw new APIError(
        errorMessages.unauthorized,
        httpStatus.UNAUTHORIZED,
        false
      );
    }
    if (!user.isVerified) {
      throw new APIError(
        errorMessages.userNotVerified,
        httpStatus.FORBIDDEN,
        false
      );
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = { authenticateJWT, initiatePassport };
