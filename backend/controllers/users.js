const User = require('../models/user');

const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  SERVER_ERROR_MESSAGE,
} = require('../utils/constants');

const getUsers = (req, res) => {
  User.find()
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body || {};

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Datos de entrada inválidos' });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'ID inválido' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Recurso no encontrado' });
      }
      return res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Datos de entrada inválidos' });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'ID inválido' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Recurso no encontrado' });
      }
      return res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body || {};
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Datos de entrada inválidos' });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'ID inválido' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Recurso no encontrado' });
      }
      return res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body || {};
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Datos de entrada inválidos' });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'ID inválido' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Recurso no encontrado' });
      }
      return res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
};
