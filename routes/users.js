const express = require('express');
const { validateGetUser, validateUpdateUserInfo, validateUpdateAvatar } = require('../middlewares/validation');

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
userRouter.get('/users/:userId', validateGetUser, getUser);

// обновляет профиль
userRouter.patch('/users/me', validateUpdateUserInfo, updateUserInfo);

// обновляет аватар
userRouter.patch('/users/me/avatar', validateUpdateAvatar, updateUserAvatar);

module.exports = userRouter;
