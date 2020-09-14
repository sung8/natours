const express = require('express');
const tourController = require('./../controllers/tourController');
// const {getAllTours, } = require('./../controllers/tourController');
const router = express.Router();

// check ID
// router.param('id', tourController.checkID);

/*
alias route for user
for a request that is done frequently
pre-fill some fields in the query string
  Solution: run a middleware function before we run the getAllTours handler
    - the middleware function will manipulate the query object that's coming in 
*/
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

// prettier-ignore
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

// prettier-ignore
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
