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
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    required: [true, 'A tour must have a summary description'],
    // trim only works for strings
    // trim cuts whitespace from input
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});

// basic model
// convention is to uppercase model names and variables
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
