const { UNAUTHORIZED_STATUS } = require('./errors');

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED_STATUS;
  }
}

module.exports = AuthError;
