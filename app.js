const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const { errors, celebrate, Joi } = require('celebrate');
const auth = require('./middlewares/auth');
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
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

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
