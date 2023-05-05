const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFound = require('../errors/notFound');
const ConflictError = require('../errors/conflict');
const WrongTokenError = require('../errors/wrongToken');

const {
  OK_STATUS,
  OK_CREATED_STATUS,
  BAD_REQUEST_STATUS,
  // UNAUTHORIZED_STATUS,
  NOT_FOUND_STATUS,
  // INTERNAL_SERVER_STATUS,
} = require('../errors/errors');

const getUsers = (req, res, next) => {
  User.find()
    .then((users) => {
      res.status(OK_STATUS).send({ data: users });
    })
    // .catch(() => {
    //   res.status(INTERNAL_SERVER_STATUS).send({ message: 'Что-то пошло не так' });
    // });
    .catch(next);
};

const getUser = (req, res, next) => {
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
      if (e instanceof NotFound) {
        res.status(NOT_FOUND_STATUS).send({ message: 'Пользователь с таким id не найден' });
      } else if (e instanceof mongoose.Error.CastError) {
        res.status(BAD_REQUEST_STATUS).send({ message: 'Переданы некорректные данные о пользователе' });
      } else {
        // res.status(INTERNAL_SERVER_STATUS).send({ message: 'Что-то пошло не так' });
        next(e);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      // аутентификация успешна
      res.status(OK_STATUS).send({ token });
    })
    .catch(() => {
      // возвращаем ошибку аутентификации
      next(new WrongTokenError('Неправильная почта или пароль'));
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then(() => {
      res.status(OK_CREATED_STATUS).send({
        data: {
          name, about, avatar, email,
        },
      });
    })
    .catch((e) => {
      if (e.code === 11000) {
        next(new ConflictError('Этот email уже зарегистрирован'));
      } else if (e instanceof mongoose.Error.ValidationError) {
        const message = Object.values(e.errors)
          .map((error) => error.message)
          .join('; ');

        res.status(BAD_REQUEST_STATUS).send({ message });
      } else {
        next(e);
        // res.status(INTERNAL_SERVER_STATUS).send({ message: 'Что-то пошло не так' });
      }
    });
};

const getCurrentUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFound();
    })
    .then((user) => {
      res.status(OK_STATUS).send({ data: user });
    })
    .catch((e) => {
      if (e instanceof NotFound) {
        res.status(NOT_FOUND_STATUS).send({ message: 'Пользователь с таким id не найден' });
      } else if (e instanceof mongoose.Error.CastError) {
        res.status(BAD_REQUEST_STATUS).send({ message: 'Переданы некорректные данные о пользователе' });
      } else {
        next(e);
        // res.status(INTERNAL_SERVER_STATUS).send({ message: 'Что-то пошло не так' });
      }
    });
};

const updateUser = (req, res, next, newData) => {
  User.findByIdAndUpdate(
    req.user._id,
    newData,
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
      if (e instanceof NotFound) {
        res.status(NOT_FOUND_STATUS).send({ message: 'Пользователь с таким id не найден' });
      } else if (e instanceof mongoose.Error.ValidationError) {
        res.status(BAD_REQUEST_STATUS).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else {
        next(e);
        // res.status(INTERNAL_SERVER_STATUS).send({ message: 'Что-то пошло не так' });
      }
    });
};

const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  return updateUser(req, res, next, { name, about });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return updateUser(req, res, next, { avatar });
};

module.exports = {
  getUsers,
  getUser,
  login,
  createUser,
  getCurrentUserInfo,
  updateUserInfo,
  updateUserAvatar,
};
