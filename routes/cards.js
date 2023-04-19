const express = require('express');
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
cardRouter.post('/cards', createCard);

// удаляет карточку по идентификатору
cardRouter.delete('/cards/:cardId', deleteCard);

// поставить лайк карточке
cardRouter.put('/cards/:cardId/likes', setLike);

// убрать лайк с карточки
cardRouter.delete('/cards/:cardId/likes', removeLike);

module.exports = cardRouter;
