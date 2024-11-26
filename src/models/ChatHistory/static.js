const {
  getPaginationValues,
  pagination,
} = require("../../utils/helperFunctions");
const mongoose = require("mongoose");

const getChatHistory = async function (userId, page = 1, limit = 10) {
  const paginationValues = getPaginationValues(page, limit);
  const result = await this.aggregate([
    {
      $match: {
        user: userId,
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

const getOrCreateSingleChatHistory = async function (
  chatId,
  title = "Untitled"
) {
  console.log({ chatId });
  const single = await this.findOneAndUpdate(
    { _id: chatId ?? new mongoose.Types.ObjectId() },
    {
      $setOnInsert: { chatTitle: title },
    },
    {
      returnOriginal: false,
      upsert: true,
    }
  );

  return single;
};
const getChatHistoryByChatId = async function (chatId) {
  const result = await this.findOne({ _id: chatId });
  return result;
};

module.exports = {
  getChatHistory,
  getOrCreateSingleChatHistory,
  getChatHistoryByChatId,
};
