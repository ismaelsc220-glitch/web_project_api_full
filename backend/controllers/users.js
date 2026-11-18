const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const HttpError = require('../utils/http-error');
const {
  BAD_REQUEST,
  UNAUTHORIZED,
} = require('../utils/constants');

const { JWT_SECRET } = require('../utils/config');

const getUsers = (req, res, next) => User.find().select('-password')
  .then((users) => res.send(users))
  .catch(next);

const createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body || {};

  if (typeof password !== 'string' || !password) {
    return next(new HttpError(
      BAD_REQUEST,
      'La contraseña es obligatoria',
    ));
  }

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      const userData = user.toObject();
      delete userData.password;

      return res.status(201).send(userData);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body || {};

  if (
    typeof email !== 'string'
    || !email
    || typeof password !== 'string'
    || !password
  ) {
    return next(new HttpError(
      BAD_REQUEST,
      'El correo y la contraseña son obligatorios',
    ));
  }

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user || !user.password) {
        throw new HttpError(
          UNAUTHORIZED,
          'Correo electrónico o contraseña incorrectos',
        );
      }

      return bcrypt.compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            throw new HttpError(
              UNAUTHORIZED,
              'Correo electrónico o contraseña incorrectos',
            );
          }

          const token = jwt.sign(
            { _id: user._id.toString() },
            JWT_SECRET,
            { expiresIn: '7d' },
          );

          return res.status(200).send({ token });
        });
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  return User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch(next);
};

const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user._id).orFail();
  return res.send(user);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body || {};
  const userId = req.user._id;

  return User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.send(user))
    .catch(next);
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body || {};
  const userId = req.user._id;

  return User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.send(user))
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  login,
  updateUser,
  updateUserAvatar,
};
