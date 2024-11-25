const Chat = require("../models/Chat");
const ChatHistory = require("../models/ChatHistory");
const { proxyRequest } = require("../utils/aiProxy");

const generateAiResponse = async (req, res) => {
  const { message, chatId } = req.body;
  const chatHistoryObj = await ChatHistory.getOrCreateSingleChatHistory(chatId);
  const getChatHistory = await Chat.getChatMessages(chatHistoryObj._id, 1, 5);

  const historyMessages = getChatHistory[0].data
    .map((msg) => msg.message)
    .flat();

  const messages = historyMessages
    ? [...historyMessages, { role: "user", content: message }]
    : [{ role: "user", content: message }];

  const response = await proxyRequest({ messages, temperature: 0 });
  const resObj = response?.choices?.[0]?.message;
  if (!resObj) {
    res.status(500).json({ error: "No response from AI" });
    return;
  }
  const toInsert = [
    { role: "user", content: message },
    { role: resObj?.role, content: resObj?.content },
  ];
  await Chat.insertMessage({ chat: chatHistoryObj._id, message: toInsert });
  res.status(200).json({ response, chatId: chatHistoryObj._id });
};

const getChatMessages = async (req, res) => {
  const { chatId, page, limit } = req.params;

  const chatHistory = await Chat.getChatMessages(chatId, page, limit);
  res.status(200).json(chatHistory);
};

const getChatHistory = async (req, res) => {
  const { page, limit } = req.params;

  const chatHistory = await ChatHistory.getChatHistory(page, limit);
  res.status(200).json(chatHistory);
};

module.exports = { generateAiResponse, getChatMessages, getChatHistory };
