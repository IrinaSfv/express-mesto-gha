const express = require('express');
const { getUsers, getUser, createUser } = require('../controllers/users');

const userRouter = express.Router;

// возвращает всех пользователей
userRouter.get('/users', getUsers);

// возвращает пользователя по _id
userRouter.get('/users/:userId', getUser);

// создаёт пользователя
userRouter.post('/users', createUser);

module.exports = userRouter;
