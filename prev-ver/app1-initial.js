const express = require('express');

// express is a function
//upon declaration/calling
// it will add a bunch of methods to our app variable
// calling the variable app is kind of standard

// express is 100% node js under the hood
// and some of the things work in a very similar way

// it makes our lives easier taking some of the complexity away
const app = express();

/*
app.get('/', (req, res) => {
    res.status(200).send('Hello from the server side!');
});
*/

// http method for the request
/*
    this method sends a response with GET
    if we change option from GET to POST, 
    we will not get anything

    we don't have route defined, so 
    Express will automatically send back 
    cannot post with 404 not found
    */

app.get('/', (req, res) => {
  res
    .status(200)
    // using .json automatically sets our content type to application json (we manuelly did this in node farm)
    // express automatically handles content-type, date, connection etc.
    .json({ message: 'Hello from the server side!', app: 'Natours' });
});

// specifying the root url
// node/express is all about requests and responses
// define post url/endpoint
app.post('/', (req, res) => {
  res.send('You can post to this endpoint...');
});

// use app.listen to start up a server
// similar to http package
const port = 3002;
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
