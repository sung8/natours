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
const tourSchema = new mongoose.Schema(
  {
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
      // deselected sensitive data from being shown to the user
      select: false,
    },
    startDates: [Date],
  },
  {
    // schema options declared for virtual properties to work
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* virtual properties
  fields that we can define in our schema, but that will not be persisted (not be saved into db to save some space)
  virtual properties make sense for things like converesions (for example, you wouldn't save value twice in both miles and kilometers)

  - let's create virtual property that contains the tour duration in weeks 
*/

// we use a regular function instead of an arrow function because an arrow function does not get its own 'this' keyword
// we need the 'this'
// 'this' point to our current document
tourSchema.virtual('durationWeeks').get(function () {
  // duration calculate in weeks
  return this.duration / 7;
});

/*
  NOTE: we cannot use virtual properties in query because they're technically not a part of the database

  so we cannot do, for example, tours.find() where duration weeks = 1 

  for instance, we could do this conversion each time after we query the data like in the controller, but this would not be good practices simply b/c we want to try to keep business and application logic separated as possible (fake models, thin controllers)
*/
// basic model
// convention is to uppercase model names and variables
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
