const express = require('express');
const mongoose = require('mongoose');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const app = express();

/* eslint-disable import/order */
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(userRouter);
app.use(cardRouter);

app.use((req, res, next) => {
  req.user = {
    _id: '644023e501f717025842249b',
  };

  next();
});

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
