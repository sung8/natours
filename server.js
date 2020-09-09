const mongoose = require('mongoose');
const dotenv = require('dotenv');

// this will read our variable from the 'config.env' file and save them to the node.js environment variables
// must go above our app file so our app file can read config file
dotenv.config({ path: './config.env' });

const app = require('./app');
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

// START THE SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
