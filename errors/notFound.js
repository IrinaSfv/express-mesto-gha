const { NOT_FOUND_STATUS } = require('./errors');

class NotFound extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = NOT_FOUND_STATUS;
  }
}

module.exports = NotFound;
