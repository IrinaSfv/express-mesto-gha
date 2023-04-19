const User = require('../models/user');
const NotFound = require('../errors/notFound');
const {
  OK_STATUS,
  OK_CREATED_STATUS,
  BAD_REQUEST_STATUS,
  NOT_FOUND_STATUS,
  INTERNAL_SERVER_STATUS,
} = require('../errors/errors');

const getUsers = (req, res) => {
  User.find()
    .then((users) => {
      res.status(OK_STATUS).send({ data: users });
    })
    .catch((e) => {
      console.log('e =>', e);
      res.status(INTERNAL_SERVER_STATUS).send({ message: 'Что-то пошло не так' });
    });
};

const getUser = (req, res) => {
  console.log(req.params);
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      throw new NotFound();
    })
    .then((user) => {
      res.status(OK_STATUS).send({ data: user });
    })
    .catch((e) => {
      console.log('e.name =>', e.name);
      if (e.name === 'NotFound') {
        res.status(NOT_FOUND_STATUS).send({ message: 'Пользователь с таким id не найден' });
      } else if (e.name === 'CastError') {
        res.status(BAD_REQUEST_STATUS).send({ message: 'Переданы некорректные данные о пользователе' });
      } else {
        res.status(INTERNAL_SERVER_STATUS).send({ message: 'Что-то пошло не так' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(OK_CREATED_STATUS).send({ data: user });
    })
    .catch((e) => {
      console.log('e.name =>', e.name);
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

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  ).orFail(() => {
    throw new NotFound();
  })
    .then((user) => {
      res.status(OK_STATUS).send({ data: user });
    })
    .catch((e) => {
      console.log('e =>', e.name);
      if (e.name === 'NotFound') {
        res.status(NOT_FOUND_STATUS).send({ message: 'Пользователь с таким id не найден' });
      } else if (e.name === 'ValidationError') {
        res.status(BAD_REQUEST_STATUS).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else {
        res.status(INTERNAL_SERVER_STATUS).send({ message: 'Что-то пошло не так' });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  ).orFail(() => {
    throw new NotFound();
  })
    .then((user) => {
      res.status(OK_STATUS).send({ data: user });
    })
    .catch((e) => {
      console.log('e =>', e.name);
      if (e.name === 'NotFound') {
        res.status(NOT_FOUND_STATUS).send({ message: 'Пользователь с таким id не найден' });
      } else if (e.name === 'ValidationError') {
        res.status(BAD_REQUEST_STATUS).send({ message: 'Переданы некорректные данные при обновлении информации' });
      } else {
        res.status(INTERNAL_SERVER_STATUS).send({ message: 'Что-то пошло не так' });
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
