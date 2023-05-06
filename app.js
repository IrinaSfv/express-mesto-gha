const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { validateLogin, validateCreateUser } = require('./middlewares/validation');
const { createUser, login } = require('./controllers/users');
// Код ошибки "Такой страницы не существует"
const { NOT_FOUND_STATUS, INTERNAL_SERVER_STATUS } = require('./errors/errors');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
// Импорт роутов
const { userRouter, cardRouter } = require('./routes');

const app = express();

app.use(express.json());

// Подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

// Подключаем роуты
app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

app.use(auth);

app.use(userRouter);
app.use(cardRouter);
app.use('*', (req, res) => {
  res.status(NOT_FOUND_STATUS).send({ message: 'Такой страницы не существует' });
});

// Обрабатываем ошибки
app.use(errors()); // обработчик ошибок celebrate

app.use((err, req, res, next) => { // централизованный обработчик
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = INTERNAL_SERVER_STATUS, message } = err;
  res
    .status(statusCode)
    // проверяем статус и выставляем сообщение в зависимости от него
    .send({
      message: statusCode === INTERNAL_SERVER_STATUS
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
