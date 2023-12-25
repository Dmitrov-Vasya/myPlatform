const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');
const { login, registration, logout } = require('../controllers/users');
const { validateLogin, validateCreateUser } = require('../utils/validate');
const usersRouter = require('./users');
const auth = require('../middlewares/auth');

// без проверки авторизации
router.post(
  '/signin',
  validateLogin,
  login,
);
router.get('/signout', logout);
router.post(
  '/signup',
  validateCreateUser,
  registration,
);

// с проверкой авторизации
router.use(auth);
router.use('/users', usersRouter);
router.use('/*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
