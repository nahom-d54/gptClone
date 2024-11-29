const express = require("express");

const chatController = require("../controllers/chat");

const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

/**
 * @swagger
 * /api/chat/generate:
 *  post:
 *   tags:
 *    - Chat
 *   summary: Generate AI response
 *   description: Generate AI response
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        message:
 *         type: string
 *        chatId:
 *         type: string
 *   responses:
 *    200:
 *     description: AI response generated
 *    500:
 *     description: Internal Server Error
 *    400:
 *     description: Bad Request
 */
router.post("/generate", asyncHandler(chatController.generateAiResponse));
/**
 * @swagger
 * /api/chat/messages/{chatId}:
 *  get:
 *   tags:
 *    - Chat
 *   summary: Get chat messages
 *   description: Get chat messages
 *   parameters:
 *    - in: path
 *      name: chatId
 *      required: true
 *      schema:
 *       type: string
 *   requestBody:
 *    required: false
 *    content:
 *     application/json:
 *     schema:
 *      type: object
 *      properties:
 *       page:
 *        type: number
 *       limit:
 *        type: number
 *   responses:
 *    200:
 *     description: Chat messages retrieved
 *    500:
 *     description: Internal Server Error
 *    400:
 *     description: Bad Request
 */
router.get("/messages/:chatId", asyncHandler(chatController.getChatMessages));

/**
 * @swagger
 * /api/chat/history:
 *  get:
 *   tags:
 *    - Chat
 *   summary: Get chat history
 *   description: Get chat history
 *   requestBody:
 *    required: false
 *    content:
 *     application/json:
 *     schema:
 *      type: object
 *      properties:
 *       page:
 *        type: number
 *       limit:
 *        type: number
 *   responses:
 *    200:
 *     description: Chat history retrieved
 *    500:
 *     description: Internal Server Error
 *    400:
 *     description: Bad Request
 */
router.get("/history", asyncHandler(chatController.getChatHistory));

/**
 * @swagger
 * /api/chat/message/{chatId}:
 *  delete:
 *   tags:
 *    - Chat
 *   summary: Delete chat history
 *   description: Delete chat history
 *   parameters:
 *    - in: path
 *    name: chatId
 *    required: true
 *   schema:
 *   type: string
 *   responses:
 *     200:
 *      description: Chat history deleted
 *     500:
 *      description: Internal Server Error
 *
 */
router.delete(
  "/message/:chatId",
  asyncHandler(chatController.deleteChatHistory)
);

module.exports = router;
