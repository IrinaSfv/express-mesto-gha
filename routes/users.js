const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUser,
  updateUserInfo,
  updateUserAvatar,
  getCurrentUserInfo,
} = require('../controllers/users');

const userRouter = express.Router();

// возвращает всех пользователей
userRouter.get('/users', getUsers);

// возвращает информацию о текущем пользователе
userRouter.get('/users/me', getCurrentUserInfo);

// возвращает пользователя по _id
userRouter.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
  }),
}), getUser);

// // создаёт пользователя
// userRouter.post('/users', createUser);

// обновляет профиль
userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUserInfo);

// обновляет аватар
userRouter.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/),
  }),
}), updateUserAvatar);

module.exports = userRouter;
