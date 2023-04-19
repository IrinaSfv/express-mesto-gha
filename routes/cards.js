const express = require('express');
const { getCards } = require('../controllers/cards');

const cardRouter = express.Router;

// возвращает все карточки
cardRouter.get('/cards', getCards);

module.exports = cardRouter;
