// everything not related to express will be outside of the app.js file

// app.js is for configuring the express application and everything that has to do with express

// environment variables are outside the scope of express

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
// we have access to this env.var. here when we didn't really define them in this file but in server.js
// the reading of the variables from the file to the node process only needs to happen once
// it's then in the process and the process is the same no matter what file we're in
// process.env is available in every single file in the project
//console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
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
