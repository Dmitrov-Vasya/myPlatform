const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const BadRequest = require('../errors/BadRequest');
const AlreadyExists = require('../errors/AlreadyExists');
const NotFoundError = require('../errors/NotFoundError');

const login = (req, res, next) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : '1j6obWGoaMlgdIxvjvBHZFTI', {
        expiresIn: '7d',
      });
      res.cookie('access_token', token, {
        httpOnly: true,
        // sameSite: 'none',
        // secure: NODE_ENV === 'production',
      })
        .status(200).send({ message: 'Авторизация прошла успешна' });
    })
    .catch((err) => {
      next(err);
    });
};

const logout = (req, res) => {
  res.clearCookie('access_token')
    .status(200).send({ message: 'Выход прошел успешно' });
};

const registration = async (req, res, next) => {
  try {
    const {
      email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const { NODE_ENV, JWT_SECRET } = process.env;
    const user = await User.create({
      email, password: hash,
    });

    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : '1j6obWGoaMlgdIxvjvBHZFTI', {
      expiresIn: '7d',
    });

    res.cookie('access_token', token, {
      httpOnly: true,
      // sameSite: 'none',
      // secure: NODE_ENV === 'production',
    })
      .status(200).send({ message: 'Авторизация прошла успешна' });

    res.status(200).send({ data: user });
  } catch (err) {
    // E11000 duplicate key error collection
    if (err.code === 11000) {
      next(new AlreadyExists('email уже существует'));
    } else if (err.name === 'ValidationError') {
      next(new BadRequest('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

const getUsersData = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
    });
};

const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(
    _id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new AlreadyExists('email уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest('Ошибка валидации'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  login, logout, registration, getUsersData, updateProfile,
};
