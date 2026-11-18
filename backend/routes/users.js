const router = require('express').Router();

const {
  getUsers,
  getUserById,
  updateUser,
  getCurrentUser,
  updateUserAvatar,
} = require('../controllers/users');

const {
  validateAvatar,
  validateProfile,
  validateUserId,
} = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.patch('/me/avatar', validateAvatar, updateUserAvatar);
router.patch('/me', validateProfile, updateUser);
router.get('/:userId', validateUserId, getUserById);

module.exports = router;
