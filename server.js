const dotenv = require('dotenv');

// this will read our variable from the 'config.env' file and save them to the node.js environment variables
// must go above our app file so our app file can read config file
dotenv.config({ path: './config.env' });

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

// START THE SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
});
