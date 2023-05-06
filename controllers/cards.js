const mongoose = require('mongoose');
const Card = require('../models/card');
const NotFound = require('../errors/notFound');
const BadRequest = require('../errors/badRequest');
const NotOwner = require('../errors/notOwner');
const {
  OK_STATUS,
  OK_CREATED_STATUS,
} = require('../errors/errors');

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.status(OK_STATUS).send({ data: cards });
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(OK_CREATED_STATUS).send({ data: card });
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.ValidationError) {
        const message = Object.values(e.errors)
          .map((error) => error.message)
          .join('; ');

        next(new BadRequest(message));
      } else {
        next(e);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const ownerId = req.user._id;
  Card.findById(cardId)
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка не найдена');
      }
      if (!card.owner.equals(ownerId)) {
        throw new NotOwner('Невозможно удалить чужую карточку');
      } else {
        Card.deleteOne(card)
          .then(() => {
            res.status(OK_STATUS).send({ data: card });
          })
          .catch(next);
      }
      // card.remove().then(() => res.status(OK_STATUS).send({ message: 'Карточка удалена' }));
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        return next(new BadRequest('Переданы некорректные данные о карточке'));
      }
      return next(e);
    });
};

const updateCardLike = (req, res, next, newData) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    newData,
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка не найдена');
      }
      res.status(OK_STATUS).send({ data: card });
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        return next(new BadRequest('Переданы некорректные данные о карточке'));
      }
      return next(e);
    });
};

const setLike = (req, res, next) => {
  const newLike = { $addToSet: { likes: req.user._id } }; // добавить _id в массив, если его там нет
  return updateCardLike(req, res, next, newLike);
};

const removeLike = (req, res, next) => {
  const likeToRemove = { $pull: { likes: req.user._id } }; // убрать _id из массива
  return updateCardLike(req, res, next, likeToRemove);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  setLike,
  removeLike,
};
