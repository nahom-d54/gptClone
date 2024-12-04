const express = require("express");
const userController = require("../controllers/user");
const asyncHandler = require("../utils/asyncHandler");
const { authenticateJWT } = require("../config/passportConfig");

const router = express.Router();

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     tags:
 *       - User
 *     summary: Login a user
 *     description: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in
 *       500:
 *         description: Internal Server Error
 *       400:
 *         description: Bad Request
 *       404:
 *         description: User not found
 */
router.post("/login", asyncHandler(userController.authenticate));

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     tags:
 *       - User
 *     summary: Register a new user
 *     description: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *       500:
 *         description: Internal Server Error
 *       400:
 *         description: Bad Request
 */
router.post("/register", asyncHandler(userController.register));

/**
 * @swagger
 * /api/user/resend-verification-email:
 *   get:
 *     tags:
 *       - User
 *     summary: Resend verification email
 *     description: Resend verification email
 *     parameters:
 *       - in: query
 *         name: email
 *         description: Email address of the user
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Verification email sent
 *       500:
 *         description: Internal Server Error
 *       400:
 *         description: Bad Request
 */
router.get(
  "/resend-verification-email",
  asyncHandler(userController.resendVerificationEmail)
);

router.post(
  "/change-password",
  authenticateJWT,
  asyncHandler(userController.changePassword)
);

router.get("/verify/:token", asyncHandler(userController.verifyUser));
module.exports = router;
