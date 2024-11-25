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

  return result;
};

const insertMessage = async function (msg) {
  await this.create({ message: msg.message, chat: msg.chat });
};

module.exports = { getChatMessages, insertMessage };
