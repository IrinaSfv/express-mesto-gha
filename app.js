const express = require('express');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
const app = express();

// Код ошибки "Такой страницы не существует"
const { NOT_FOUND_STATUS } = require('./errors/errors');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

// Импорт роутов
const { userRouter, cardRouter } = require('./routes');

app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// Подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '644023e501f717025842249b',
  };

  next();
});

// Подключаем роуты
app.use(userRouter);
app.use(cardRouter);

app.use('*', (req, res) => {
  res.status(NOT_FOUND_STATUS).send({ message: 'Такой страницы не существует' });
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
