const User = require("../models/user");

// GET /users — devuelve todos los usuarios
const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Error al obtener usuarios" });
    });
};

// GET /users/:userId — devuelve un usuario por _id
const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.status(200).json(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(400).json({ message: "ID de usuario inválido" });
      }
      if (err.statusCode === 404 || err.name === "DocumentNotFoundError") {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      return res.status(500).json({ message: "Error al obtener usuario" });
    });
};

// POST /users — crea un nuevo usuario
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .json({ message: "Datos inválidos", details: err.message });
      }
      return res.status(500).json({ message: "Error al crear usuario" });
    });
};

// PATCH /users/me — actualizar el perfil (name, about)
const updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user && req.user._id,
    { name, about },
    { new: true, runValidators: true, context: "query" }
  )
    .orFail(() => {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.status(200).json(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .json({ message: "Datos inválidos", details: err.message });
      }
      if (err.name === "CastError") {
        return res.status(400).json({ message: "ID de usuario inválido" });
      }
      if (err.statusCode === 404 || err.name === "DocumentNotFoundError") {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      return res.status(500).json({ message: "Error al actualizar perfil" });
    });
};

// PATCH /users/me/avatar — actualizar avatar
const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user && req.user._id,
    { avatar },
    { new: true, runValidators: true, context: "query" }
  )
    .orFail(() => {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.status(200).json(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .json({ message: "Datos inválidos", details: err.message });
      }
      if (err.name === "CastError") {
        return res.status(400).json({ message: "ID de usuario inválido" });
      }
      if (err.statusCode === 404 || err.name === "DocumentNotFoundError") {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      return res.status(500).json({ message: "Error al actualizar avatar" });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
