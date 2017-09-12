const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const itemSchema = require('./Item');

// Define our model
const listingSchema = new Schema({
  _user: {type: Schema.Types.ObjectId, ref: 'User'},
  items: [itemSchema],
  location: {type:String},
  availability:{type:String}, 
  price:{type:Number}
});


// Create the model class
const ListingClass = mongoose.model('listing', listingSchema);

// Export the model
module.exports = ListingClass;
