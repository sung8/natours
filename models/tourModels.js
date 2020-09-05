const mongoose = require('mongoose');
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

module.exports = Tour;
