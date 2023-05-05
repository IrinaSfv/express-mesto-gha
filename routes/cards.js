const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi } = require('celebrate');

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
cardRouter.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().regex(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/),
  }),
}), createCard);

// удаляет карточку по идентификатору
cardRouter.delete('/cards/:cardId', deleteCard);

// поставить лайк карточке
cardRouter.put('/cards/:cardId/likes', setLike);

// убрать лайк с карточки
cardRouter.delete('/cards/:cardId/likes', removeLike);

module.exports = cardRouter;
