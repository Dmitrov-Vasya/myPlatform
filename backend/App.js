const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('./middlewares/cors');
const { limiter } = require('./utils/config');
const {
  requestLogger,
  errorLogger,
} = require('./middlewares/logger');
const router = require('./router/main');
const errorResponse = require('./middlewares/errorResponse');

dotenv.config();

const app = express(console.log('Сервер запущен'));
mongoose.connect('mongodb://127.0.0.1:27017/my_fitness_platform');

app.use(cors);
app.use(cookieParser());
app.use(limiter);

app.use(bodyParser.json());
app.use(requestLogger);

app.use('/', router);

app.use(errorLogger);
app.use(errors());
app.use(errorResponse);

app.listen(3000);
