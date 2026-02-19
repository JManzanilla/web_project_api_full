// routes/cards.js
const router = require("express").Router();
const { getCards, createCard, deleteCard } = require("../controllers/cards");

router.get("/", getCards); // GET /cards
router.post("/", createCard); // POST /cards
router.delete("/:cardId", deleteCard); // DELETE /cards/:cardId

// Likes
const { likeCard, unlikeCard } = require("../controllers/cards");
router.put("/:cardId/likes", likeCard); // PUT /cards/:cardId/likes
router.delete("/:cardId/likes", unlikeCard); // DELETE /cards/:cardId/likes

module.exports = router;
