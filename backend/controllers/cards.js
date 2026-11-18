const Card = require('../models/card');
const { FORBIDDEN, NOT_FOUND } = require('../utils/constants');
const HttpError = require('../utils/http-error');

const getCards = (req, res, next) => Card.find()
  .then((cards) => res.send(cards))
  .catch(next);

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  return Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => res.status(201).send(card))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  return Card.findById(cardId)
    .orFail()
    .then((card) => {
      if (card.owner.toString() !== req.user._id.toString()) {
        throw new HttpError(
          FORBIDDEN,
          'No tienes permiso para eliminar esta tarjeta',
        );
      }

      return Card.findOneAndDelete({
        _id: cardId,
        owner: req.user._id,
      });
    })
    .then((deletedCard) => {
      if (!deletedCard) {
        throw new HttpError(NOT_FOUND, 'Tarjeta no encontrada');
      }

      return res.send(deletedCard);
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail()
    .then((card) => res.send(card))
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .orFail()
    .then((card) => res.send(card))
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
