const fs = require('fs');
const express = require('express');

const app = express();

// middleware (express.json)
// - function that can modify incoming req data

app.use(express.json());

// top-level code (only executed once)
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// FUNCTIONS
// get request handler function for all tours
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
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

// function call: get request handler for all tours
app.get('/api/v1/tours', getAllTours);
// function call: get request handler for one specific tours
app.get('/api/v1/tours/:id', getTour);

// function call: post request handler to create new tour
app.post('/api/v1/tours', createTour);

// function call: update tour by id
app.patch('/api/v1/tours/:id', updateTour);

// function call: delete tour by id
app.delete('/api/v1/tours/:id', deleteTour);

// use app.listen to start up a server
const port = 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
