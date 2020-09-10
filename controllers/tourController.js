// const fs = require('fs');
const Tour = require('./../models/tourModel');
const { query } = require('express');

// ROUTE HANDLERS
exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);
    // BUILD QUERY
    // 1) Filtering
    // create shallow copy of req.query
    // destructuring with ...
    const queryObj = { ...req.query };
    // create an array of all the fields we want to exclude
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // remove all the excludedFields fields by loop over the fields
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2) Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));

    // what we want
    // { difficulty: 'easy', duration: { $gte: 5} }
    //console.log(req.query);
    // logs
    // { difficulty: 'easy', duration: { gte: '5' } }
    // goal is to place $ in front of corresponding mongodb operators (gte, gt, lte, lt)

    //const query = Tour.find(queryObj);
    let query = Tour.find(JSON.parse(queryStr));
    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // 2) Sorting
    /* chain methods */
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      console.log(sortBy);
      query = query.sort(sortBy);
      // sort('price ratingsAverage')
      //127.0.0.1:8000/api/v1/tours?sort=-price,ratingsAverage
      // -price descending price ascending
    } else {
      // in case user doesn't specify, a default sort
      query = query.sort('-createdAt');
    }

    // EXECUTE QUERY
    const tours = await query;
    res.status(200).json({
      status: 'success',
      // include time of request in response
      // requestAt: req.requestTime,
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

// get request handler for specific tour by id
exports.getTour = async (req, res) => {
  try {
    /*
    Tour.findOne({ _id: req.params.id})
      - id is _id in mongodb
      - we can query for id field
      - specify filter object, property that we're searching for, and the value that we want to search for
      - findOne() method will then only return one of the documents
    */

    // this shorthand for ^
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

// post request handler
// create new tour
exports.createTour = async (req, res) => {
  /* 
  const newTour = new Tour({});
  // .save() is part of PROTOTYPE object 
  newTours.save();
    instead of this we can just do ... 
  Tour.create({});
   ^ returns a promise... we can use .then(), but we will instead use async await
  */

  /* we pass data that we want to store in db as a new tour into .create() function
    - this data comes from the post body
    -  req.body is the data that comes with the post request as an object
    - newTour will be a new document with new ID and everything
  */
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid data set',
    });
  }

  // once we try to post through postman and check mongo compass. it will not show 'difficulty' bc it's not in our schema
  // data not in schema will be ignored and not stored
};

// update tour by id
// (not actually implemented bc we don't want to update our json data)
exports.updateTour = async (req, res) => {
  try {
    // find by id and update
    /*
    arguments:
      1. id - to first find the document to be updated
      2. data that we actually want to change, data will be in the body just like the post request
      3. options - 
        - 'new' - the new updated document is the one to be returned
        - 'runValidators' - runs the validators that we specified in the schema 
    
    Mongoose query methods 
      -find, findById, findByIdAndUpdate, etc.
      -findById and findByIdAndUpdate are mostly shorthand for multiple queries at once
      -Model.prototype.methodName
        - in JS, .prototype always means an object created from a class 
        - the method will be available on all instances CREATED through that object (Model in this case). not the object class itself, but the CREATED object 
    */
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        //tour: tour (don't have to write this since ES6)
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

// delete tour
// (not actually implemented bc we don't want to delete our json data)
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    // no need to store it in a variable
    // in RESTful api, it is common practice to not send back any data to the client when there's a delete operation
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};
