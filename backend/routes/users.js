
const router = require('express').Router();

const {
  getUsers,
  getUserById,
  updateUser,
  getCurrentUser,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.patch('/me/avatar', updateUserAvatar);
router.patch('/me', updateUser);
router.get('/:userId', getUserById);

module.exports = router;
