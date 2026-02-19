// controllers/cards.js
const Card = require("../models/card");

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).json(cards))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Error al obtener tarjetas" });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  // owner viene del middleware temporal que inyecta req.user
  const owner = req.user && req.user._id ? req.user._id : undefined;

  // Validación rápida en servidor antes de mandar a la BD
  if (!name || !link) {
    return res
      .status(400)
      .json({ message: "Faltan campos obligatorios: name y link" });
  }
  if (!owner) {
    return res
      .status(401)
      .json({ message: "Usuario no autenticado (owner faltante)" });
  }

  Card.insertOne({ name, link, owner })
    .then((card) => res.status(201).json(card))
    .catch((err) => {
      console.error(err);
      // Mongoose validation error -> datos inválidos enviados
      if (err.name === "ValidationError") {
        return res.status(400).json({
          message: "Datos inválidos al crear tarjeta",
          details: err.message,
        });
      }
      // Otro tipo de error de servidor
      return res.status(500).json({ message: "Error al crear tarjeta" });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .orFail(() => {
      const error = new Error("Tarjeta no encontrada");
      error.statusCode = 404;
      throw error;
    })
    .then((card) => {
      if (!req.user || card.owner.toString() !== req.user._id) {
        return res
          .status(403)
          .json({ message: "No autorizado para eliminar esta tarjeta" });
      }
      return Card.deleteOne({ _id: cardId }).then(() =>
        res.status(200).json({ message: "Tarjeta eliminada" })
      );
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(400).json({ message: "ID de tarjeta inválido" });
      }
      if (err.statusCode === 404 || err.name === "DocumentNotFoundError") {
        return res.status(404).json({ message: "Tarjeta no encontrada" });
      }
      return res.status(500).json({ message: "Error al eliminar tarjeta" });
    });
};

// PUT /cards/:cardId/likes — dar like a una tarjeta
const likeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user && req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Tarjeta no encontrada");
      error.statusCode = 404;
      throw error;
    })
    .then((card) => res.status(200).json(card))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(400).json({ message: "ID de tarjeta inválido" });
      }
      if (err.statusCode === 404 || err.name === "DocumentNotFoundError") {
        return res.status(404).json({ message: "Tarjeta no encontrada" });
      }
      return res.status(500).json({ message: "Error al actualizar likes" });
    });
};

// DELETE /cards/:cardId/likes — quitar like
const unlikeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user && req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Tarjeta no encontrada");
      error.statusCode = 404;
      throw error;
    })
    .then((card) => res.status(200).json(card))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(400).json({ message: "ID de tarjeta inválido" });
      }
      if (err.statusCode === 404 || err.name === "DocumentNotFoundError") {
        return res.status(404).json({ message: "Tarjeta no encontrada" });
      }
      return res.status(500).json({ message: "Error al actualizar likes" });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
};
