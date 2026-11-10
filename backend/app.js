const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/card');
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  SERVER_ERROR_MESSAGE,
} = require('./utils/constants');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6ac41c3e735c18b9fe6dbe16',
  };
  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Requested resource not found' });
});

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  if (err.type === 'entity.parse.failed') {
    return res.status(BAD_REQUEST).send({ message: 'JSON invalido' });
  }
  return res.status(SERVER_ERROR).send({ message: SERVER_ERROR_MESSAGE });
});

mongoose.connect('mongodb://localhost:27017/aroundb')
  .then(() => {
    app.listen(PORT);
  })
  .catch((err) => {
    console.error('No se pudo conectar a MongoDB:', err.message);
    process.exitCode = 1;
  });
