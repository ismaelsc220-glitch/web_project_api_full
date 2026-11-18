const jwt = require('jsonwebtoken');
const HttpError = require('../utils/http-error');
const { UNAUTHORIZED } = require('../utils/constants');

const { JWT_SECRET } = require('../utils/config');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new HttpError(
      UNAUTHORIZED,
      'Se requiere autorización',
    ));
  }

  const token = authorization.slice('Bearer '.length);

  try {
    req.user = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new HttpError(
      UNAUTHORIZED,
      'Token inválido o expirado',
    ));
  }

  return next();
};

module.exports = auth;
