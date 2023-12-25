const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');

module.exports = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return next(new AuthorizationError('Необходима авторизация'));
    }
    const reqUser = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : '1j6obWGoaMlgdIxvjvBHZFTI');
    req.user = reqUser;
    return next();
  } catch (err) {
    return next(new AuthorizationError('Необходима авторизация'));
  }
};
