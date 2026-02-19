const router = require("express").Router();
const { getUsers, getUserById, createUser } = require("../controllers/users");

router.get("/", getUsers); // GET /users
router.get("/:userId", getUserById); // GET /users/:userId
router.post("/", createUser); // POST /users

module.exports = router;
