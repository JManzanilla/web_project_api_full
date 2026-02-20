const router = require("express").Router();
const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getCurrentUser,
} = require("../controllers/users");

// 1. Obtener todos los usuarios (Ruta administrativa/general)
router.get("/", getUsers);

// 2. Obtener el usuario actual (MUY IMPORTANTE: debe ir antes de /:userId)
// Esta es la que usa tu frontend como 'http://api-around.../users/me'
router.get("/me", getCurrentUser);

// 3. Obtener un usuario específico por su ID
router.get("/:userId", getUserById);

// 4. Actualizar información del perfil del usuario logueado
router.patch("/me", updateProfile);

// 5. Actualizar el avatar del usuario logueado
router.patch("/me/avatar", updateAvatar);

module.exports = router;
