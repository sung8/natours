const mongoose = require('mongoose');
const dotenv = require('dotenv');

// this will read our variable from the 'config.env' file and save them to the node.js environment variables
// must go above our app file so our app file can read config file
dotenv.config({ path: './config.env' });

// replace <PASSWORD> placeholder with our real password
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

/* first argument is the connection string
  second argument is an object with options
    - need to specify these options in order to deal with some deprecation warnings
    - use these options when creating another application

  the connect method returns a promise
    - handle the promise using .then()
    - the promise gets access to a connection object (con)
    - con for connection, is the resolved value for the promise
    - logged to view the object's connection contents
*/
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    //console.log(con.connections);
    console.log('DB connection successful!');
  });

const app = require('./app');

/* ENVIRONMENT VARIABLES

  - DEF: environment variables are global variables that are used to define the environment in which a node app is running

  - 'app.get('env')' is set by express */
console.log(app.get('env'));
// this logs 'development'
//   - we are currently in development environment

/* node.js itself sets a lot of environment
 node uses most of these env. var. internally
 ex: current working directory, home folder, login, script used to start, configurations
 these variables come from the process core module and are set the moment that the process started

 we didn't have to require the process module 
 it is available everywhere automatically 

 express depends on a variable called NODE_ENV 
 - a variable that is sort of convention that define whether we're in development or production mode
 - express doesn't define this variable so we have to manually 

 ways to define: 
 1. terminal 
*/
//console.log(process.env);

// Mongoose uses native JS data types
// const tourSchema = new mongoose.Schema({
//   name: String,
//   rating: Number,
//   price: Number,
// });

// basic schema
// specifies schema for our data
//  - descriptions and validation
const tourSchema = new mongoose.Schema({
  // schema type options
  // each data type can have different options
  name: {
    type: String,
    // required is the error
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

// basic model
// convention is to uppercase model names and variables
const Tour = mongoose.model('Tour', tourSchema);

// new document that will be created out of the Tour model
// analogy: uses same syntax of JS function constructor/JS classes (ES6) for creating new objects
// testTour document is an instance of the Tour model
const testTour = new Tour({
  name: 'The Park Camper',
  price: 997,
});

// methods used to interact with a the database
/* saves it to our tours collection in the database
  - returns a promise that we can consume
  - we can use then() to consume, but better to use async/await
  the result value of the promise that .save() returns is access to the the final document as it is in the database
*/
testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log('Error 💥: ', err);
  });

// START THE SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
