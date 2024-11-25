const {
  getPaginationValues,
  pagination,
} = require("../../utils/helperFunctions");

const getChatMessages = async (chatId, page = 1, limit = 10) => {
  const paginationValues = getPaginationValues(page, limit);

  const result = await this.aggrigate([
    {
      $match: {
        chatId: chatId,
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

module.exports = { getChatMessages };
