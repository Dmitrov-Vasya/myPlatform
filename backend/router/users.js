const router = require('express').Router();

const { validateUpdateProfile } = require('../utils/validate');
const {
  getUsersData, updateProfile,
} = require('../controllers/users');

router.get('/me', getUsersData);
router.patch(
  '/me',
  validateUpdateProfile,
  updateProfile,
);

module.exports = router;
