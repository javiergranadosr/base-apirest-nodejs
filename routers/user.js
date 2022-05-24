const { Router } = require("express");
const {
  getUsers,
  createUser,
  updateUser,
  updateUserPatch,
  deleteUser,
} = require("../controllers/user");

const router = Router();

router.get("/", getUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.patch("/", updateUserPatch);
router.delete("/", deleteUser);

module.exports = router;
