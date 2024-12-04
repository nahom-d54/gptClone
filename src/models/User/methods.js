const bcrypt = require("bcryptjs");

/**
 * Compare a candidate password to the user's password.
 *
 * @param {string} candidatePassword - The password to compare.
 * @returns {Promise<boolean>} - Whether the password is valid.
 */
const comparePassword = async function (candidatePassword) {
  const match = await bcrypt.compare(candidatePassword, this.password);

  console.log(candidatePassword, this.password, match);
  return await bcrypt.compare(candidatePassword, this.password);
};

const changePassword = async function (previousPassword, newPassword) {
  if (!this.comparePassword(previousPassword)) {
    throw new Error("Invalid password");
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
