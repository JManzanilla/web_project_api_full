const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Extraemos las variables de entorno
const { NODE_ENV, JWT_SECRET } = process.env;

// GET /users — devuelve todos los usuarios
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).json(users))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Error al obtener usuarios" });
    });
};

// GET /users/me — info del usuario logueado (USA EL TOKEN)
const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail(() => {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.status(200).json(user))
    .catch((err) => {
      if (err.statusCode === 404)
        return res.status(404).json({ message: "Usuario no encontrado" });
      res.status(500).json({ message: "Error al obtener usuario actual" });
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
      if (err.name === "CastError")
        return res.status(400).json({ message: "ID de usuario inválido" });
      if (err.statusCode === 404)
        return res.status(404).json({ message: "Usuario no encontrado" });
      res.status(500).json({ message: "Error al obtener usuario" });
    });
};

// POST /signup — Registro (Antes era createUser)
const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  // 1. Encriptamos la contraseña
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      // 2. Creamos el usuario con la contraseña encriptada
      return User.create({ name, about, avatar, email, password: hash });
    })
    .then((user) => {
      // 3. Quitamos la contraseña del objeto antes de enviarlo
      const userObj = user.toObject();
      delete userObj.password;
      res.status(201).json(userObj);
    })
    .catch((err) => {
      if (err.name === "ValidationError")
        return res.status(400).json({ message: "Datos inválidos" });
      if (err.code === 11000)
        return res.status(409).json({ message: "El correo ya existe" });
      res.status(500).json({ message: "Error al crear usuario" });
    });
};

// POST /signin — Login
const login = (req, res) => {
  const { email, password } = req.body;

  // Buscamos al usuario y pedimos explícitamente la contraseña
  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Email o contraseña incorrectos"));
      }
      // Comparamos contraseñas
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Email o contraseña incorrectos"));
        }
        // Generamos el Token
        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
          { expiresIn: "7d" },
        );
        res.send({ token });
      });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

// PATCH /users/me — actualizar el perfil
const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(200).json(user))
    .catch((err) => {
      if (err.name === "ValidationError")
        return res.status(400).json({ message: "Datos de perfil inválidos" });
      res.status(500).json({ message: "Error al actualizar perfil" });
    });
};

// PATCH /users/me/avatar — actualizar avatar
const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(200).json(user))
    .catch((err) => {
      if (err.name === "ValidationError")
        return res.status(400).json({ message: "URL de avatar inválida" });
      res.status(500).json({ message: "Error al actualizar avatar" });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  login, // <--- No olvides exportar login
  updateProfile,
  updateAvatar,
  getCurrentUser,
};
