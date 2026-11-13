const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const User = require("../models/user");

const JWT_SECRET = process.env.JWT_SECRET;

const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  SERVER_ERROR_MESSAGE,
} = require("../utils/constants");

const getUsers = (req, res) => {
  User.find().select('-password')
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
    });
};

const createUser = (req, res) => {
  const { email, password, name, about, avatar } = req.body || {};

  if (typeof password !== "string" || !password) {
    return res.status(BAD_REQUEST).send({
      message: "La contraseña es obligatoria",
    });
  }

  return bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        email,
        password: hash,
        name,
        about,
        avatar,
      }),
    )
    .then((user) => {
      const userData = user.toObject();
      delete userData.password;

      return res.status(201).send(userData);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(409).send({
          message: "El correo electrónico ya está registrado",
        });
      }

      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({
          message: "Datos de entrada inválidos",
        });
      }

      return res.status(SERVER_ERROR).send({
        message: SERVER_ERROR_MESSAGE,
      });
    });
};

const login = (req, res) => {
  const { email, password } = req.body || {};


  if (
    typeof email !== 'string'
    || !email
    || typeof password !== 'string'
    || !password
  ) {
    return res.status(400).send({
      message: 'El correo y la contraseña son obligatorios',
    });
  }


  return User.findOne({ email })
    .then((user) => {
      if (!user || !user.password) {
        return res.status(401).send({
          message: 'Correo electrónico o contraseña incorrectos',
        });
      }


      return bcrypt.compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            return res.status(401).send({
              message: 'Correo electrónico o contraseña incorrectos',
            });
          }


          const token = jwt.sign(
            { _id: user._id.toString() },
            JWT_SECRET,
            { expiresIn: '7d' },
          );


          return res.status(200).send({ token });
        });
    })
    .catch(() => res.status(500).send({
      message: 'Error interno del servidor',
    }));
};


const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Datos de entrada inválidos" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "ID inválido" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Recurso no encontrado" });
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
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Datos de entrada inválidos" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "ID inválido" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Recurso no encontrado" });
      }
      return res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body || {};
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Datos de entrada inválidos" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "ID inválido" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Recurso no encontrado" });
      }
      return res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  login,
  updateUser,
  updateUserAvatar,
};
