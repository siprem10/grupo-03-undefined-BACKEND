const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

const indexRouter = require('./routes/index');

const port = process.env.PORT || 3000;

const app = express();
app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
    allowedHeaders: [      
      'Access-Control-Allow-Origin',
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'auth-token',
      'withcredentials',
      'Authorization',
      'authorization',
    ],
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static('uploads'));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  const error = (res.locals.error =
    req.app.get('env') === 'development' ? err : {});
  const status = err.status || 500;

  // render the error page
  res.status(status).send({ error });
  next();
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Servidor funcionando en el puerto ${port}`);
});

module.exports = app;
