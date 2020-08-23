const fs = require('fs');
const express = require('express');
const { nextTick } = require('process');
const morgan = require('morgan');

// import routes
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// MIDDLEWARE
// logging
app.use(morgan('dev'));
// body parser
app.use(express.json());

// serving static files from a folder and not from a route
// static files - files sitting in our file system
app.use(express.static(`${__dirname}/public`));

// our own middleware
app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES
// mounting routers to two different routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
