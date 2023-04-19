const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find()
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((e) => {
      console.log('e =>', e);
      res.status(500).send({ message: 'Smth went wrong' });
    });
};

module.exports = {
  getCards,
};
