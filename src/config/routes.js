const express = require("express");
const subscriptionRouter = require("../routes/subscription");
const subscriptionTypesRouter = require("../routes/subscriptionTypes");
const userRouter = require("../routes/user");
const rateRouter = require("../routes/rates");
const {
  checkIfAdmin,
  checkIfAuthenticated,
} = require("../controllers/middlewares");
const { authenticateJWT } = require("../config/passportConfig");
const asyncHandler = require("../utils/asyncHandler");
const rateController = require("../controllers/rates");

const router = express.Router();

router.use("/subscription", authenticateJWT, subscriptionRouter);
router.use(
  "/subscription-types",
  authenticateJWT,
  checkIfAdmin,
  subscriptionTypesRouter
);
router.use("/rates", checkIfAuthenticated, rateRouter);
router.use("/user", userRouter);
router.get("/cron", asyncHandler(rateController.updateExchangeRate));

module.exports = router;
