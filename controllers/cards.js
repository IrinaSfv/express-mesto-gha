const Card = require('../models/card');
const NotFound = require('../errors/notFound');
const {
  OK_STATUS,
  OK_CREATED_STATUS,
  BAD_REQUEST_STATUS,
  NOT_FOUND_STATUS,
  INTERNAL_SERVER_STATUS,
} = require('../errors/errors');

const getCards = (req, res) => {
  Card.find()
    .then((cards) => {
      res.status(OK_STATUS).send({ data: cards });
    })
    .catch((e) => {
      console.log('e =>', e);
      res.status(INTERNAL_SERVER_STATUS).send({ message: 'Что-то пошло не так' });
    });
};

const createCard = (req, res) => {
  console.log(req.user._id);
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(OK_CREATED_STATUS).send({ data: card });
    })
    .catch((e) => {
      console.log('e =>', e.name);
      if (e.name === 'ValidationError') {
        const message = Object.values(e.errors)
          .map((error) => error.message)
          .join('; ');

        res.status(BAD_REQUEST_STATUS).send({ message });
      } else {
        res.status(INTERNAL_SERVER_STATUS).send({ message: 'Что-то пошло не так' });
      }
    });
};

const deleteCard = (req, res) => {
  console.log(req.user._id);
  const { userId } = req.params;
  Card.findByIdAndRemove(userId)
    .orFail(() => {
      throw new NotFound();
    })
    .then((card) => {
      res.status(OK_STATUS).send({ data: card });
    })
    .catch((e) => {
      if (e.name === 'NotFound') {
        res.status(NOT_FOUND_STATUS).send({ message: 'Карточка не найдена' });
      } else if (e.name === 'CastError') {
        res.status(BAD_REQUEST_STATUS).send({ message: 'Переданы некорректные данные о карточке' });
      } else {
        res.status(INTERNAL_SERVER_STATUS).send({ message: 'Что-то пошло не так' });
      }
    });
};

const setLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).orFail(() => {
    throw new NotFound();
  })
    .then((card) => {
      res.status(OK_CREATED_STATUS).send({ data: card });
    })
    .catch((e) => {
      if (e.name === 'NotFound') {
        res.status(NOT_FOUND_STATUS).send({ message: 'Карточка не найдена' });
      } else if (e.name === 'CastError') {
        res.status(BAD_REQUEST_STATUS).send({ message: 'Переданы некорректные данные о карточке' });
      } else {
        res.status(INTERNAL_SERVER_STATUS).send({ message: 'Что-то пошло не так' });
      }
    });
};

const removeLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).orFail(() => {
    throw new NotFound();
  })
    .then((card) => {
      res.status(OK_STATUS).send({ data: card });
    })
    .catch((e) => {
      if (e.name === 'NotFound') {
        res.status(NOT_FOUND_STATUS).send({ message: 'Карточка не найдена' });
      } else if (e.name === 'CastError') {
        res.status(BAD_REQUEST_STATUS).send({ message: 'Переданы некорректные данные о карточке' });
      } else {
        res.status(INTERNAL_SERVER_STATUS).send({ message: 'Что-то пошло не так' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  setLike,
  removeLike,
};
