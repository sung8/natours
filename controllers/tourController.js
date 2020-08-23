const fs = require('fs');

// top-level code (only executed once)
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// check id
// removes the repeated code of ID check in getTour, updateTour, and deleteTour

exports.checkID = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);
  if (req.params.id * 1 > tours.length) {
    // if id is invalid, make sure to RETURN so the req-res cycle ends here and doesn't hit next()
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

// ROUTE HANDLERS
exports.getAllTours = (req, res) => {
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
exports.getTour = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;

  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

// post request handler
// create new tour
exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;

  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
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
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

// delete tour
// (not actually implemented bc we don't want to delete our json data)
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
