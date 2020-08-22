const fs = require('fs');
const express = require('express');

const app = express();

// middleware (express.json)
// stands between req and res
// - function that can modify incoming req data
// - necessary step that the req goes through
// - data from the body is added to the request obj by using the middleware
app.use(express.json());

// top-level code (only executed once)
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// get request handler for all tours
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      // ES6 is key and value same, you can just write "tours"
      // just to specify writing this way
      //tours: tours,
      tours,
    },
  });
});

// get request handler for specific tour by id
/* route and what to specify 
'/:id' -> /5 (id)
'/:id/:x/:y' -> /5/23/42
'/:id/:x/:y?' -> /5/23/[optional]
*/
app.get('/api/v1/tours/:id', (req, res) => {
  // req.param is an object that automatically the value to our variable (parameter that we defined)
  console.log(req.params);
  // the id values passed in by us is stored as string
  // we need to convert it to a number
  // trick: in js, if we multiply a string that looks like a number with another number, it automatically converts the string to a number
  const id = req.params.id * 1;

  // find() - js array method
  // pass in callback function, in each iteration we have access to the current element
  // returns either true or false in each iteration
  // the find method will create an array which only contains the element where the comparison 'el.id === id' turns out to be true
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
});

// post request handler
app.post('/api/v1/tours', (req, res) => {
  //data from the body logged
  //console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  //Object.assign allows us to create a new object by merging two objects together
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  //persist into the file
  //overwrite the tours-simple.json
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
});

app.patch('/api/v1/tours/:id', (req, res) => {
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
});

// use app.listen to start up a server
const port = 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
