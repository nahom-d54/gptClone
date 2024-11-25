const subscriptionTypeController = require("../controllers/subscriptionTypes");
const express = require("express");

const router = express.Router();

/**
 * @swagger
 * /subscription-types:
 *   get:
 *     tags:
 *       - Subscription Types
 *     summary: Get all subscription types
 *     description: Returns all subscription types
 *     responses:
 *       200:
 *         description: The subscription types
 *   post:
 *     tags:
 *       - Subscription Types
 *     summary: Create a new subscription type
 *     description: Create a new subscription type
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: number
 *               price:
 *                 type: number
 *               quota:
 *                 type: number
 *               rateLimitPerSecond:
 *                 type: number
 *     responses:
 *       201:
 *         description: The subscription type was created
 *       500:
 *         description: Internal Server Error
 */
router.get("/", subscriptionTypeController.getSubscriptionTypes);
router.post("/", subscriptionTypeController.createSubscriptionType);

/**
 * @swagger
 * /subscription-types/{id}:
 *   get:
 *     tags:
 *       - Subscription Types
 *     summary: Get a subscription type
 *     description: Returns a subscription type
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The subscription type ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The subscription type
 *       404:
 *         description: Subscription type not found
 *   patch:
 *     tags:
 *       - Subscription Types
 *     summary: Update a subscription type
 *     description: Update a subscription type
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The subscription type ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: number
 *               price:
 *                 type: number
 *               quota:
 *                 type: number
 *               rateLimitPerSecond:
 *                 type: number
 *     responses:
 *       200:
 *         description: The subscription type was updated
 *
 *   delete:
 *     tags:
 *       - Subscription Types
 *     summary: Delete a subscription type
 *     description: Delete a subscription type
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The subscription type ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The subscription type was deleted
 *       404:
 *         description: Subscription type not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", subscriptionTypeController.getSubscriptionType);
router.patch("/:id", subscriptionTypeController.updateSubscriptionType);
router.delete("/:id", subscriptionTypeController.deleteSubscriptionType);

module.exports = router;
