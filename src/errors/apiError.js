class APIError extends Error {
  constructor(message, statusCode, fullStack = false) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.fullStack = fullStack;
  }
}

module.exports = APIError;
