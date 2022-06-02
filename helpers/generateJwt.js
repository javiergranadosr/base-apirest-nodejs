const jwt = require("jsonwebtoken");

const generateJwt = (uid = "") => {
  return new Promise((resolve, reject) => {
    const payload = { uid };
    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      {
        expiresIn: "4h",
      },
      (error, token) => {
        if (error) {
          console.log(error);
          reject("Error al generar token.");
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = { generateJwt };
