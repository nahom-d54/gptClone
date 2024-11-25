const {
  getPaginationValues,
  pagination,
} = require("../../utils/helperFunctions");
const mongoose = require("mongoose");

const getChatHistory = async function (page = 1, limit = 10) {
  const paginationValues = getPaginationValues(page, limit);
  const result = await this.aggrigate([
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

module.exports = { getChatHistory, getOrCreateSingleChatHistory };
