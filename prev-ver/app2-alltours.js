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

// get request handler
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
  //always need to send something to finish the req/res cycle
  //res.send('Done');
  // if we leave ^ here, we are sending response again(twice total, two headers) causing error. we can only send one per request.
});
/* post result
  when we do get all tours, it will not show up right away because it only shows up when you restart the server(bc reading the .json file only occurs once at top level code). however, bc nodemon, it saves and restarts the server automatically so it shows up right away in postman.
*/
// use app.listen to start up a server
const port = 3001;
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
