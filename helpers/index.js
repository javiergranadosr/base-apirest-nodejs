const customValidators = require("./customValidators");
const generateJwt = require("./generateJwt");
const googleVerify = require("./googleVerify");
const uploads = require("./uploads");

module.exports = {
  ...customValidators,
  ...generateJwt,
  ...googleVerify,
  ...uploads,
};
