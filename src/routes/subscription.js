const express = require("express");
const subscriptionController = require("../controllers/subscription");
const asyncHandler = require("../utils/asyncHandler");
const { authenticateJWT } = require("../config/passportConfig");
const router = express.Router();

router.use(authenticateJWT);

/**
 * @swagger
 * /subscription:
 *   get:
 *     tags:
 *       - Subscription
 *     summary: Get all subscriptions
 *     description: Returns all subscriptions
 *     responses:
 *       200:
 *         description: The subscriptions
 *   post:
 *     tags:
 *       - Subscription
 *     summary: Create a new subscription
 *     description: Create a new subscription
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subscriptionType:
 *                 type: string
 *     responses:
 *       201:
 *         description: The subscription
 *       400:
 *         description: Bad Request
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/", asyncHandler(subscriptionController.getSubscription));
router.post("/", asyncHandler(subscriptionController.createSubscription));

/**
 * @swagger
 * /subscription/verify:
 *   post:
 *     tags:
 *       - Subscription
 *     summary: Verify subscription payment
 *     description: Verify subscription payment
 *     responses:
 *       201:
 *         description: The subscription
 *       400:
 *         description: Bad Request
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.post(
  "/verify",
  asyncHandler(subscriptionController.verifySubscriptionPayment)
);

/**
 * @swagger
 * /subscription/types:
 *   get:
 *     tags:
 *       - Subscription
 *     summary: Get all subscription types
 *     description: Returns all subscription types
 *     responses:
 *       200:
 *         description: The subscription types
 *       500:
 *         description: Internal Server Error
 */
router.get("/types", asyncHandler(subscriptionController.getSubscriptionTypes));

module.exports = router;
