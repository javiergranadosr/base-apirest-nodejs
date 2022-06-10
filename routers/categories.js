const { Router } = require("express");
const { check } = require("express-validator");
const { existCategoryId } = require("../helpers");
const { validateFields, validateJwt, hasRole } = require("../middlewares");
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require("../controllers/category");

const router = Router();

// Obtener listado categorias - publico
router.get("/", getCategories);

// Obtener detalle de una categoria - publico
// Validacion personalizada, validar id, que exista en bd
router.get(
  "/:id",
  [
    check("id", "No es un id valido.").isMongoId(),
    check("id").custom(existCategoryId),
    validateFields,
  ],
  getCategory
);

// Crear una nueva categoria  - Cualquier persona con un token y rol valido

router.post(
  "/",
  [
    validateJwt,
    hasRole("ADMIN_ROLE", "USER_ROLE"),
    check("name", "El nombre es obligatorio.").not().isEmpty(),
    validateFields,
  ],
  createCategory
);

// Actualizar una categoria por id - Cualquier persona con un token y rol valido

router.put(
  "/:id",
  [
    validateJwt,
    hasRole("ADMIN_ROLE", "USER_ROLE"),
    check("id", "No es un id valido.").isMongoId(),
    check("id").custom(existCategoryId),
    check("name", "El nombre es obligatorio.").not().isEmpty(),
    validateFields,
  ],
  updateCategory
);

// Borrar una categoria - Administrador

router.delete(
  "/:id",
  [
    validateJwt,
    hasRole("ADMIN_ROLE"),
    check("id", "No es un id valido.").isMongoId(),
    check("id").custom(existCategoryId),
    validateFields,
  ],
  deleteCategory
);

module.exports = router;
