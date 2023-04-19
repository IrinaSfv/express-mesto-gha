const User = require('../models/user');

const getUsers = (req, res) => {
  User.find()
    .then((users) => {
      res.send({ data: users });
    })
    .catch((e) => {
      console.log('e =>', e);
      res.status(500).send({ message: 'Smth went wrong' });
    });
};

const getUser = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .orFail(() => {
      throw new Error('Not found');
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((e) => {
      if (e.message === 'Not found') {
        res.status(404).send({ message: 'User not found' });
      } else {
        res.status(500).send({ message: 'Smth went wrong' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch((e) => {
      console.log('e =>', e.name);
      if (e === 'ValidationError') {
        const message = Object.values(e.errors)
          .map((error) => error.message)
          .join('; ');

        res.status(400).send({ message });
      } else {
        res.status(500).send({ message: 'Smth went wrong' });
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
