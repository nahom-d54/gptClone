const bcrypt = require("bcryptjs");
const APIError = require("../../errors/apiError");

/**
 * Compare a candidate password to the user's password.
 *
 * @param {string} candidatePassword - The password to compare.
 * @returns {Promise<boolean>} - Whether the password is valid.
 */
const comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const changePassword = async function (previousPassword, newPassword) {
  const validPassword = await this.comparePassword(previousPassword);
  console.log({ validPassword });
  if (!validPassword) {
    throw new APIError("Invalid password", 400);
  }
  this.password = newPassword;
  return await this.save();
};

const cleanUser = function () {
  const { password, ...rest } = this.toJSON();
  return rest;
};

module.exports = {
  comparePassword,
  changePassword,
  cleanUser,
};
