const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validateFields");
const {
  isRole,
  existEmail,
  existUserById,
} = require("../helpers/customValidators");

const {
  getUsers,
  createUser,
  updateUser,
  updateUserPatch,
  deleteUser,
} = require("../controllers/user");

const router = Router();

router.get("/", getUsers);

router.post(
  "/",
  [
    check("name", "El nombre no es valido").not().isEmpty(),
    check("email", "El correo no es valido").isEmail(),
    check("email").custom(existEmail),
    check("password", "El password debe tener mas de 6 letras.").isLength({
      min: 6,
    }),
    //check("rol", "No es un rol valido").isIn(["ADMIN_ROLE", "USER_ROL"]),
    check("rol").custom(isRole),
    validateFields,
  ],
  createUser
);

router.put(
  "/:id",
  [
    check("id", "No es un id valido.").isMongoId(),
    check("id").custom(existUserById),
    check("rol").custom(isRole),
    validateFields,
  ],
  updateUser
);

router.patch("/", updateUserPatch);

router.delete(
  "/:id",
  [
    check("id", "No es un id valido.").isMongoId(),
    check("id").custom(existUserById),
    validateFields,
  ],
  deleteUser
);

module.exports = router;
