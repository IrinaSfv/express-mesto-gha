const mongoose = require('mongoose');
const { REG_URL } = require('../config/config');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Название должно быть заполнено'],
    minlength: [2, 'Название не может быть короче 2 символов'],
    maxlength: [30, 'Название не может быть длиннее 30 символов'],
  },
  link: {
    type: String,
    required: [true, 'Ссылка на картинку должна быть заполнена'],
    validate: {
      validator(url) {
        return REG_URL.test(url);
      },
      message: 'Неверно указан URL изображения',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
