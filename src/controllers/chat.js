const Chat = require("../models/Chat");
const ChatHistory = require("../models/ChatHistory");
const { proxyRequest } = require("../utils/aiProxy");
const OpenAI = require("openai");

const generateAiResponse = async (req, res) => {
  const { message, chat } = req.body;
  const userId = req.user._id;

  const chatHistoryObj = await ChatHistory.getOrCreateSingleChatHistory(
    chat,
    userId,
    `${message.slice(0, 21)}...`
  );

  const getChatHistory = await Chat.getChatMessages(chatHistoryObj._id, 1, 5);

  const historyMessages = getChatHistory[0].data
    .map((msg) => msg.message)
    .flat();

  const messages = historyMessages
    ? [...historyMessages, { role: "user", content: message }]
    : [{ role: "user", content: message }];

  const client = new OpenAI({
    apiKey: process.env.AI_API_KEY,
    baseURL: process.env.AI_API_URL,
  });

  const response = await client.chat.completions.create({
    model: "grok-beta",
    messages: messages,
    stream: false,
  });

  console.log(response);

  //const response = await proxyRequest({ messages, temperature: 0 });

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

const deleteChatHistory = async (req, res) => {
  const chatId = req.params.chatId;

  const getChat = await ChatHistory.getChatHistoryByChatId(chatId);

  if (!getChat) {
    res.status(404).json({ error: "Chat not found" });
    return;
  } else if (getChat.user.toString() !== req.user._id.toString()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  await ChatHistory.deleteChatHistoryByChatId(chatId);
  await Chat.deleteByChatId(chatId);
  res.status(200).json({ message: "Chat history deleted" });
};

const updateChatHistoryTitle = async (req, res) => {
  const chatId = req.params.chatId;
  const { title } = req.body;

  const getChat = await ChatHistory.getChatHistoryByChatId(chatId);

  if (!getChat) {
    res.status(404).json({ error: "Chat not found" });
    return;
  } else if (getChat.user.toString() !== req.user._id.toString()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  await ChatHistory.updateChatHistoryTitle(chatId, title);
  res.status(200).json({ message: "Chat history title updated" });
};

const getChatMessages = async (req, res) => {
  const { page, limit } = req.query;
  const chatId = req.params.chatId;

  const getChat = await ChatHistory.getChatHistoryByChatId(chatId);

  if (!getChat) {
    res.status(404).json({ error: "Chat not found" });
    return;
  } else if (getChat.user.toString() !== req.user._id.toString()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const chatHistory = await Chat.getChatMessages(getChat._id, page, limit);
  res.status(200).json(chatHistory);
};

const getChatHistory = async (req, res) => {
  const { page, limit } = req.query;

  const userId = req.user._id;

  const chatHistory = await ChatHistory.getChatHistory(userId, page, limit);
  res.status(200).json(chatHistory);
};

module.exports = {
  generateAiResponse,
  getChatMessages,
  getChatHistory,
  updateChatHistoryTitle,
  deleteChatHistory,
};
