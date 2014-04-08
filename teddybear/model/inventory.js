var Mongoose = require('mongoose');

exports.InventorySchema = new Mongoose.Schema({
	_id: Number,
  	title:String,
	publisher:String,
	writer:String,
	artist:String,
	releaseDate:Date,
	issue:Number,
	volume:Number,
	price:Number,
	image:String,
	description:String
});