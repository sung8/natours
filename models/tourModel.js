const mongoose = require('mongoose');
// Mongoose uses native JS data types
// const tourSchema = new mongoose.Schema({
//   name: String,
//   rating: Number,
//   price: Number,
// });

const slugify = require('slugify');

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
    slug: String,
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
    secretTour: {
      type: Boolean,
      default: false,
    },
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

// DOCUMENT MIDDLEWARE
// runs before .save() and .create() command
// doesn't run on .insertMany()
tourSchema.pre('save', function (next) {
  // 'this' points to currently processed middleware
  console.log(this);
  // in order to trigger this function, we need to run a .save() or .create() command
  // we must create a new tour using our API to trigger this middleware

  //create a slug for each of these documents
  this.slug = slugify(this.name, { lower: true });
  // next to call next middleware in stack
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('Will save document...');
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  // tourSchema.pre('find', function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  console.log(docs);
  next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

/*
Mongoose Middleware
- to make something happen between two events
- for example, each time a new document is saved to the db, we can run a function between the save command is issued and the actual saving of the document
  - or after the actual saving
- Mongoose middleware is also called pre and post hooks (bc we can create function to run before or after a certain event)

Four types:
 - document middleware - middleware that can act on the currently processed document 
 - query middleware
 - aggregate middleware
 - model middleware

Just like virtual properties, we define middleware in the schema
*/
