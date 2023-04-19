const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find()
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((e) => {
      console.log('e =>', e);
      res.status(500).send({ message: 'Smth went wrong' });
    });
};

const createCard = (req, res) => {
  console.log(req.user._id);
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((e) => {
      console.log('e =>', e.name);
      if (e.name === 'ValidationError') {
        const message = Object.values(e.errors)
          .map((error) => error.message)
          .join('; ');

        res.status(400).send({ message });
      } else {
        res.status(500).send({ message: 'Smth went wrong' });
      }
    });
};

const deleteCard = (req, res) => {
  console.log(req.user._id);
  const { userId } = req.params;
  Card.findById(userId)
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        res.status(400).send({ message: 'Переданы неверные данные' });
      }
      card.remove()
        .then(() => res.send({ message: 'Карточка успешно удалена' }));
    })
    .catch((e) => {
      if (e.message === 'Not found') {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};

const setLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).orFail(() => {
    throw new Error('Not found');
  })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((e) => {
      if (e.message === 'Not found') {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};

const removeLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).orFail(() => {
    throw new Error('Not found');
  })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((e) => {
      if (e.message === 'Not found') {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
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
