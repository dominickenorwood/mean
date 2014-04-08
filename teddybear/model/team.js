// Bring Mongoose into the app
var mongoose = require('mongoose');

var inventorySchema = new mongoose.Schema({
	title:String,
	publisher:String,
	writer:String,
	artist:String,
	releaseDate:Date,
	price:Number,
	description:String
});
var Inventory = module.exports = mongoose.model('Team', inventorySchema);