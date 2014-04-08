// Bring Mongoose into the app
var mongoose = require('mongoose');

// Build the connection string
var dbURI = 'localhost';

// Create the database connection
var db = mongoose.createConnection(dbURI, 'mytestapp');

// CONNECTION EVENTS
// When successfully connected
db.on('connected', function () {
	console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
db.on('error',function (err) {
	console.log('Mongoose default connection error: ' + err);
});
 
// When the connection is disconnected
db.on('disconnected', function () {
	console.log('Mongoose default connection disconnected');
});

mongoose.connect(dbURI);

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

// BRING IN YOUR SCHEMAS & MODELS
// For example
require('./../model/inventory');