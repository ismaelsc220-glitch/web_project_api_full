
const router = require('express').Router();

const {
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.patch('/me/avatar', updateUserAvatar);
router.patch('/me', updateUser);

router.get('/:userId', getUserById);

module.exports = router;
