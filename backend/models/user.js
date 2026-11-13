
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'El correo electrónico no es válido',
    },
  },

  password: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Jacques Cousteau',
  },

  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Explorador',
  },

  avatar: {
    type: String,
    default: 'https://practicum-content.s3.us-west-1.amazonaws.com/resources/moved_avatar_1604080799.jpg',
    validate: {
      validator: (value) => validator.isURL(value, {
        protocols: ['http', 'https'],
        require_protocol: true,
      }),
      message: 'El formato de la URL no es válido',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
