const Card = require('../models/card');
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  SERVER_ERROR_MESSAGE,
  FORBIDDEN,
} = require('../utils/constants');

const getCards = (req, res) => {
  Card.find()
    .then((cards) => {
      res.send(cards);
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

const createCard = (req, res) => {
  const { name, link } = req.body || {};
  const owner = req.user._id;

  Card.create({
    name,
    link,
    owner,
  })
    .then((card) => {
      res.status(201).send(card);
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


const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .orFail()
    .then((card) => {
      if (card.owner.toString() !== req.user._id.toString()) {
        return res.status(FORBIDDEN).send({
          message: 'No tienes permiso para eliminar esta tarjeta',
        });
      }

      return Card.findOneAndDelete({
        _id: cardId,
        owner: req.user._id,
      })
        .then((deletedCard) => {
          if (!deletedCard) {
            return res.status(NOT_FOUND).send({
              message: 'Tarjeta no encontrada',
            });
          }

          return res.send(deletedCard);
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Datos de entrada inválidos',
        });
      }

      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'ID inválido',
        });
      }

      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({
          message: 'Recurso no encontrado',
        });
      }

      return res.status(SERVER_ERROR).send({
        message: SERVER_ERROR_MESSAGE,
      });
    });
};


const likeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.send(card);
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

const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.send(card);
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
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
