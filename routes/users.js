const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

const userRouter = express.Router();

// возвращает всех пользователей
userRouter.get('/users', getUsers);

// возвращает пользователя по _id
userRouter.get('/users/:userId', getUser);

// создаёт пользователя
userRouter.post('/users', createUser);

// обновляет профиль
userRouter.patch('/users/me', updateUserInfo);

// создаёт пользователя
userRouter.patch('/users/me/avatar', updateUserAvatar);

module.exports = userRouter;
