const jwt = require("jsonwebtoken");
const {
  generateJsonWebToken,
  DateFuncs,
} = require("../../utils/helperFunctions");
const { sendVerificationEmail } = require("../../config/nodeMailer");

/**
 * Save the user with a hashed password
 *
 * @async
 * @returns {Promise<User>} - The saved user
 */
const createUser = async function (userObject) {
  const { firstName, lastName, username, email, password } = userObject;

  const usernameLower = username.toLowerCase();
  const emailLower = email.toLowerCase();

  const allowedUsername = /^[a-zA-Z0-9_]{3,30}$/;
  const allowedEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!allowedUsername.test(username)) {
    return {
      error:
        "Username must be between 3 and 30 characters and can only contain letters, numbers and underscores",
    };
  }
  if (!allowedEmail.test(email)) {
    return {
      error: "Invalid email",
    };
  }

  const findUser = await this.findOne({
    $or: [{ username: username }, { email: email }],
  });
  if (findUser) {
    if (findUser.email === emailLower && findUser.username === usernameLower) {
      return {
        error: "User already exists",
      };
    } else if (findUser.email === email) {
      return {
        error: "A User with this Email already exists",
      };
    } else if (findUser.username === username) {
      return {
        error: "A User with this Username already exists",
      };
    }
  }

  const newUser = new this({ firstName, lastName, username, email, password });
  newUser.lastVerificationEmailSent = Date.now();

  await newUser.save();
  const cleanUser = newUser.cleanUser();

  cleanUser.token = generateJsonWebToken(cleanUser);
  const EMAIL_JWT_SECRET = process.env.EMAIL_JWT_SECRET;

  const token = generateJsonWebToken(cleanUser, "1h", EMAIL_JWT_SECRET);

  //await sendVerificationEmail(`${process.env.APP_URL}user/verify/${token}?email=${this.email}`, this.email);

  return cleanUser;
};
const authenticate = async function (email, password) {
  const user = await this.findOne({ email });

  if (!user) {
    return null;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return null;
  }
  const rest = user.cleanUser();
  rest.token = generateJsonWebToken(rest);
  return rest;
};

const verifyUser = async function (token, email) {
  const user = await this.findOne({ email });
  if (!user) {
    return {
      error: "User not found",
    };
  }
  const EMAIL_JWT_SECRET = process.env.EMAIL_JWT_SECRET;
  const payload = jwt.verify(token, EMAIL_JWT_SECRET);

  if (user.isVerified) {
    return {
      error: "User already verified",
    };
  }
  if (payload.exp < Date.now() / 1000) {
    return {
      error: "Token expired",
    };
  }

  if (!payload) {
    return {
      error: "Invalid token",
    };
  }
  if (String(payload._id) !== String(user._id)) {
    return {
      error: "Invalid token",
    };
  }
  user.isVerified = true;
  await user.save();

  return user.cleanUser();
};

const resendVerificationEmail = async function (email) {
  const user = await this.findOne({ email });
  if (!user) {
    return {
      error: "User not found",
    };
  }
  if (user.isVerified) {
    return {
      error: "User already verified",
    };
  }
  const untilWait = DateFuncs.timedelta(user.lastVerificationEmailSent, {
    minutes: 5,
  });
  const now = new Date();
  const waitTime = ((untilWait - now) / 1000).toFixed(0);

  if (user.lastVerificationEmailSent && now < untilWait) {
    return {
      error: `Verification email already sent wait ${waitTime} seconds before sending another request`,
    };
  }
  user.lastVerificationEmailSent = now;
  await user.save();
  const EMAIL_JWT_SECRET = process.env.EMAIL_JWT_SECRET;
  const token = generateJsonWebToken(user.cleanUser(), "1h", EMAIL_JWT_SECRET);
  await sendVerificationEmail(
    `${process.env.APP_URL}user/verify/${token}?email=${user.email}`,
    user.email
  );
  return user;
};
module.exports = {
  authenticate,
  verifyUser,
  createUser,
  resendVerificationEmail,
};
