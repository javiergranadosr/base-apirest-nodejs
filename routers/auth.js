const { Router } = require("express");
const { check } = require("express-validator");
const { login, googleSignIn } = require("../controllers/auth");
const { validateFields } = require("../middlewares/validateFields");

const router = new Router();

router.post(
  "/login",
  [
    check("email", "El email es obligatorio.").isEmail(),
    check("password", "El password es obligatorio.").not().isEmpty(),
    validateFields,
  ],
  login
);

router.post(
  "/google",
  [
    check("tokenId", "El token id de google es obligatorio.").not().isEmpty(),
    validateFields,
  ],
  googleSignIn
);

module.exports = router;
