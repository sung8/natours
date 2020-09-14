// const fs = require('fs');
const Tour = require('./../models/tourModel');
const { query } = require('express');
const APIFeatures = require('./../utils/apiFeatures');

/*
alias middleware
for a request that is done frequently
pre-fill some fields in the query string
  Solution: run a middleware function before we run the getAllTours handler
    - the middleware function will manipulate the query object that's coming in 
*/
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};
// we are prefilling the query string so that the user doesn't have to manually do it
// in postman:
// 127.0.0.1:8000/api/v1/tours/top-5-cheap

// ROUTE HANDLERS
exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    // query chain of methods to filter through
    // query.sort().select().skip().limit()

    // EXECUTE QUERY
    // make sure APIFeatures object's query functions return 'this' so we can chain the methods
    // 'this' is the object itself which has access to each of these methods

    /*
      - we are creating a new object of the APIFeatures class
      - in there, we are passing a query object and the query string that's coming from Express
      - using each of the four methods, we manipulate the query  
      - by the end, we await the result of the query so that it can come back with all the selected documents
      - the query is stored inside 'features' object
    */
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;
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

exports.getTourStats = async (req, res) => {
  try {
    //aggregation pipeline
    const stats = await Tour.aggregate([
      // match stage
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      // group stage
      {
        $group: {
          // when id is defined null it just shows general info
          // _id: '$difficulty',
          //_id: '$ratingsAverage',
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      // we can also repeat stages
      // this stage excludes EASY from data of difficulties shown
      // {
      //   $match: { _id: { $ne: 'EASY' } },
      // },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

/* Natour's Company needs us to implement a function to calculate the busiest month of a given year
Calculate how many tours start in each of the month of a given year 
Company needs this function to prepare accordingly for these tours (hire tour guides, buy equipment, etc.)
Solve this real-world business problem with aggregation pipelining
 */
exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            // gte operator works with mongodb
            // mongodb good at working with/comparing dates
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          //_id identifies what we want to group our data by
          _id: { $month: '$startDates' },
          //count the amount of tours that have it at that month
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: {
          // 0 means don't show up in response
          // 1 means show up
          _id: 0,
        },
      },
      {
        // 1 is ascending order, -1 is descending order
        $sort: { numTourStarts: -1 },
      },
      {
        // limits number of outputs
        // 6 for top 6 busiest months
        // 3 for top 3 busiest months
        // 12 for all months
        $limit: 12,
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};
