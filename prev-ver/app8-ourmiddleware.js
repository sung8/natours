const fs = require('fs');
const express = require('express');
const { nextTick } = require('process');

const app = express();

// middleware (express.json)
// - function that can modify incoming req data
// express.json() calls json method and returns a function that is added to the middleware stack
// we can also create our own middleware function
app.use(express.json());

// by defining, req/res/next express knows we are defining a middleware function
// we can call the third argument anything, it just must represent next function
app.use((req, res, next) => {
  // windows key + semicolon for emoji
  console.log('Hello from the middleware 👋');
  // MUST CALL NEXT() function
  // otherwise req-res cycle will be stuck in this middleware function
  next();
});

// let's pretend we have some route handler that needs info on when exactly a request happens
// we can use Date() function and toISOString() method to format it 
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
// if we put our middleware after the route function, it would never be called because we placed it after.
// ORDER MATTERS in Express!! 

// top-level code (only executed once)
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// FUNCTIONS
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

app
  .route('/api/v1/tours')
  .get(getAllTours)
  .post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);
  
// use app.listen to start up a server
const port = 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
