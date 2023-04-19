const User = require('../models/user');

const getUsers = (req, res) => {
  User.find()
    .then((users) => {
      res.send({ data: users });
    })
    .catch((e) => {
      console.log('e =>', e);
      res.status(500).send({ message: 'Что-то пошло не так' });
    });
};

const getUser = (req, res) => {
  console.log(req.params);
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((e) => {
      console.log('e.name =>', e.name);
      console.log('e.message =>', e.message);
      if (e.message === 'Not found') {
        res.status(404).send({ message: 'Пользователь с таким id не найден' });
      } else if (e.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные о пользователе' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch((e) => {
      console.log('e.name =>', e.name);
      if (e.name === 'ValidationError') {
        const message = Object.values(e.errors)
          .map((error) => error.message)
          .join('; ');

        res.status(400).send({ message });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true, upsert: false },
  ).orFail(() => {
    throw new Error('Not found');
  })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((e) => {
      console.log('e =>', e.name);
      console.log('e.message =>', e.message);
      if (e.name === 'ValidationError') {
        const message = Object.values(e.errors)
          .map((error) => error.message)
          .join('; ');

        res.status(400).send({ message });
      } else if (e.message === 'Not found') {
        res.status(404).send({ message: 'Пользователь с таким id не найден' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true, upsert: false },
  ).orFail(() => {
    throw new Error('Not found');
  })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((e) => {
      console.log('e =>', e.name);
      console.log('e.message =>', e.message);
      if (e.name === 'ValidationError') {
        const message = Object.values(e.errors)
          .map((error) => error.message)
          .join('; ');

        res.status(400).send({ message });
      } else if (e.message === 'Not found') {
        res.status(404).send({ message: 'Пользователь с таким id не найден' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};
