const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define our model
const itemSchema = new Schema({
  equipmentType: {type: String },
  make:{type:String},
  model: {type:String},
  attribute:{type:String}, 
  property:{type:String},
  condition:{type:String},
  imageUrl:{type:String}
});

// Export the model
module.exports = itemSchema;
