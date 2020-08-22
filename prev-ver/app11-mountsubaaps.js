const fs = require('fs');
const express = require('express');
const { nextTick } = require('process');
const morgan = require('morgan');

const app = express();

// 1) MIDDLEWARE
// logging middleware
app.use(morgan('dev'));

app.use(express.json());

// OUR OWN MIDDLEWARE

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// top-level code (only executed once)
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// 2) ROUTE HANDLERS
// get request handler function for all tours
const getAllTours = (req, res) => {
  // log time of request middleware function
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    // include time of request in response
    requestAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

// get request handler for specific tour by id
const getTour = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;

  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

// post request handler
// create new tour
const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;

  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      //status code 201 = created
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

// update tour by id
// (not actually implemented bc we don't want to update our json data)
const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

// delete tour
// (not actually implemented bc we don't want to delete our json data)
const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
// 3) ROUTES

// creates sub apps for the different routers
// mounting routes
// router declaration
const tourRouter = express.Router();
const userRouter = express.Router();

// prettier-ignore
tourRouter
  .route('/')
  .get(getAllTours)
  .post(createTour);

// prettier-ignore
tourRouter
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);
// prettier-ignore
userRouter
  .route('/')
  .get(getAllUsers)
  .post(createUser);
// prettier-ignore
userRouter
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

// cannot use the routers before declaring them
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
// 4) START THE SERVER
// use app.listen to start up a server
const port = 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
