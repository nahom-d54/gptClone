const errorMessages = {
  invalidToken: "Invalid token",
  invalidEmailOrPassword: "Invalid email or password",
  invalidEmail: "Invalid email",
  invalidPassword: "Invalid password",
  invalidPhoneNumber: "Invalid phone number",
  invalidName: "Invalid name",
  invalidEmailOrPhoneNumber: "Invalid email or phone number",
  userAlreadyExists: "User already exists",
  userNotFound: "User not found",
  userRegistrationFailed: "User registration failed",
  unauthorized: "Unauthorized",
  userNotVerified: "User not verified",
  userSubscriptionNotFoundOrActive: "User subscription not found or not active",
  userSubscriptionTypeNotFound: "User subscription type not found",
  subscriptionNotFound: "Subscription not found",
  userSubscriptionExpired: "User subscription expired renew subscription",
  userSubscriptionQuotaExceeded: "User subscription quota exceeded",
  userSubscriptionRatelimitExceeded: (rateLimitPerSecond, diffSeconds) =>
    `User subscription rate limit exceeded try again in ${
      rateLimitPerSecond - diffSeconds
    } seconds`,
  notAuthorizedForAction: "You are not authorized to perform this action",
};

module.exports = { errorMessages };
