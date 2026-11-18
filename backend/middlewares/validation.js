const { celebrate, Joi, Segments } = require('celebrate');
const validator = require('validator');

const profileText = Joi.string().min(2).max(30);
const objectId = Joi.string().hex().length(24).required();

const url = Joi.string().custom((value, helpers) => {
  const isValid = validator.isURL(value, {
    protocols: ['http', 'https'],
    require_protocol: true,
  });

  return isValid ? value : helpers.error('string.uri');
});

const credentials = {
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().required(),
};

const validateBody = (fields) => celebrate({
  [Segments.BODY]: Joi.object(fields).required(),
});

module.exports = {
  validateSignup: validateBody({
    ...credentials,
    name: profileText.empty(''),
    about: profileText.empty(''),
    avatar: url.empty(''),
  }),
  validateSignin: validateBody(credentials),
  validateCard: validateBody({
    name: profileText.required(),
    link: url.required(),
  }),
  validateProfile: celebrate({
    [Segments.BODY]: Joi.object({
      name: profileText,
      about: profileText,
    }).min(1).required(),
  }),
  validateAvatar: validateBody({
    avatar: url.required(),
  }),
  validateCardId: celebrate({
    [Segments.PARAMS]: Joi.object({ cardId: objectId }),
  }),
  validateUserId: celebrate({
    [Segments.PARAMS]: Joi.object({ userId: objectId }),
  }),
};
