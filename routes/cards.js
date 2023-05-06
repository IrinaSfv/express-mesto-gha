const express = require('express');
const { validateCreateCard, validateUpdateCard } = require('../middlewares/validation');

const {
  getCards,
  createCard,
  deleteCard,
  setLike,
  removeLike,
} = require('../controllers/cards');

const cardRouter = express.Router();

// возвращает все карточки
cardRouter.get('/cards', getCards);

// создаёт карточку POST /cards
cardRouter.post('/cards', validateCreateCard, createCard);

// удаляет карточку по идентификатору
cardRouter.delete('/cards/:cardId', validateUpdateCard, deleteCard);

// поставить лайк карточке
cardRouter.put('/cards/:cardId/likes', validateUpdateCard, setLike);

// убрать лайк с карточки
cardRouter.delete('/cards/:cardId/likes', validateUpdateCard, removeLike);

module.exports = cardRouter;
