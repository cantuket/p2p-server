const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define our model
const itemSchema = new Schema({
  equipmentType: {type: String },
  make:{type:String},
  model: {type:String},
  watts:{type:Number}, 
  bulb:{type:String},
  condition:{type:String}
});

// Export the model
module.exports = itemSchema;
