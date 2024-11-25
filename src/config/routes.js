const express = require("express");

const userRouter = require("../routes/user");
const chatRouter = require("../routes/chat");

const {
  checkIfAdmin,
  checkIfAuthenticated,
} = require("../controllers/middlewares");
const { authenticateJWT } = require("../config/passportConfig");

const router = express.Router();

router.use("/chat", authenticateJWT, chatRouter);
router.use("/user", userRouter);

module.exports = router;
