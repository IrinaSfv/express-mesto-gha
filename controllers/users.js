const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFound = require('../errors/notFound');
const BadRequest = require('../errors/badRequest');
const AuthError = require('../errors/authError');
const ConflictError = require('../errors/conflict');

const {
  OK_STATUS,
  OK_CREATED_STATUS,
} = require('../errors/errors');

const getUsers = (req, res, next) => {
  User.find()
    .then((users) => {
      res.status(OK_STATUS).send({ data: users });
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  console.log(req.params);
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь с таким id не найден');
      }
      res.status(OK_STATUS).send({ data: user });
    })
    .catch((e) => {
      if (e instanceof mongoose.Error.CastError) {
        next(new BadRequest('Переданы некорректные данные о пользователе'));
      } else {
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
      next(new AuthError('Неправильная почта или пароль'));
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

        next(new BadRequest(message));
      } else {
        next(e);
      }
    });
};

const getCurrentUserInfo = (req, res, next) => {
  const userId = req.user._id;
  console.log(userId);
  User.findById(userId)
    .orFail(() => {
      throw new NotFound('Пользователь с таким id не найден');
    })
    .then((user) => {
      res.status(OK_STATUS).send({ data: user });
    })
    .catch(next);
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
    throw new NotFound('Пользователь с таким id не найден');
  })
    .then((user) => {
      res.status(OK_STATUS).send({ data: user });
    })
    .catch(next);
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
