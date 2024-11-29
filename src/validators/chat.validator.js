const { body } = require("express-validator");
const generateMessage = () => [
  body("message")
    .isString()
    .withMessage("Message must be a string")
    .isLength({ min: 1 })
    .withMessage("Message must be at least 1 character long"),
  body("chat")
    .optional()
    .isMongoId()
    .withMessage("Chat must be a valid mongo id"),
];

module.exports = { generateMessage };
