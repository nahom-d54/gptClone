const mongoose = require("mongoose");

const {
  getPaginationValues,
  pagination,
} = require("../../utils/helperFunctions");

const getChatMessages = async function (chatId, page = 1, limit = 10) {
  const paginationValues = getPaginationValues(page, limit);

  const result = await this.aggregate([
    {
      $match: {
        chat: chatId,
      },
    },
    {
      $sort: {
        createdAt: 1,
      },
    },
    ...pagination(paginationValues.skip, paginationValues.limit),
  ]);

  const r = await this.find({ chat: chatId });

  return result;
};

const insertMessage = async function (msg) {
  await this.create({ message: msg.message, chat: msg.chat });
};

const deleteByChatId = async function (chatId) {
  await this.deleteMany({ chat: chatId });
};

module.exports = { getChatMessages, insertMessage, deleteByChatId };
