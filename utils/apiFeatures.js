
class APIFeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
  
    // return 'this' object so we can chain the class functions in the handlers
    filter() {
      const queryObj = { ...this.queryString };
      const excludedFields = ['page', 'sort', 'limit', 'fields'];
      excludedFields.forEach((el) => delete queryObj[el]);
  
      // 2) Advanced Filtering
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
      console.log(JSON.parse(queryStr));
  
      this.query.find();
      // let query = Tour.find(JSON.parse(queryStr));
      return this;
    }
  
    sort() {
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(',').join(' ');
        this.query = this.query.sort(sortBy);
        // sort('price ratingsAverage')
        //127.0.0.1:8000/api/v1/tours?sort=-price,ratingsAverage
        // -price descending price ascending
      } else {
        this.query = this.query.sort('-createdAt');
      }
  
      return this;
    }
    limitFields() {
      // 3) Field limiting
      /* for a client, it's always ideal to receive as little data as possible to reduce bandwidth that is consumed with each request. especially for data-heavy data requests.
       */
      if (this.queryString.fields) {
        // including fields
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      } else {
        //default
        // excluding fields... everything but '__v'
        this.query = this.query.select('-__v');
      }
      return this;
    }
    paginate() {
      // 4) Pagination
      // ex: 1 mil total results, we don't want to show the user all 1 mil, declare default amount
      // multiply by 1 to convert string to number
      // default is 1
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 100;
      const skip = (page - 1) * limit;
      //page=3&limit=10
      // 1-10 page 1, 11-20 page 2, 21-30 page 3
      // user should not have to deal with skip value
      this.query = this.query.skip(skip).limit(limit);
  
      return this;
    }
}

module.exports = APIFeatures;