require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { isCelebrateError } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/card');
const auth = require('./middlewares/auth');
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  SERVER_ERROR_MESSAGE,
} = require('./utils/constants');
const { createUser, login } = require('./controllers/users');
const { validateSignup, validateSignin } = require('./middlewares/validation');
const HttpError = require('./utils/http-error');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
const PORT = 3000;

app.use(requestLogger);
app.use(cors({
  origin: [
    'https://around-sprint19.ddnsfree.com',
    'https://www.around-sprint19.ddnsfree.com',
  ],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.post('/signup', validateSignup, createUser);
app.post('/signin', validateSignin, login);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((req, res, next) => next(new HttpError(
  NOT_FOUND,
  'Requested resource not found',
)));

app.use(errorLogger);

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(BAD_REQUEST).send({ message: 'JSON inválido' });
  }

  if (err.name === 'CastError') {
    return res.status(BAD_REQUEST).send({ message: 'ID inválido' });
  }

  if (isCelebrateError(err) || err.name === 'ValidationError') {
    return res.status(BAD_REQUEST).send({
      message: 'Datos de entrada inválidos',
    });
  }

  if (err.name === 'DocumentNotFoundError') {
    return res.status(NOT_FOUND).send({ message: 'Recurso no encontrado' });
  }

  if (err.code === 11000) {
    return res.status(409).send({
      message: 'El correo electrónico ya está registrado',
    });
  }
  if (err instanceof HttpError) {
    return res.status(err.statusCode).send({
      message: err.message,
    });
  }
  return res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
});

mongoose
  .connect('mongodb://localhost:27017/aroundb')
  .then(() => {
    console.log('Conexión con MongoDB establecida correctamente');

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('No se pudo conectar a MongoDB:', err.message);
    process.exitCode = 1;
  });
