
/**
 * Module dependencies.
 */

var express = require('express');
//var db = require('./model/db');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var stylus = require('stylus');
var nib = require('nib');

var app = express();

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
//app.use(express.bodyParser());
app.use(express.bodyParser({ 
    keepExtensions: true, 
    uploadDir: __dirname + '/public/uploads',
    limit: '2mb'
  }));
app.use(express.methodOverride());
app.use(app.router);
app.use(stylus.middleware(
        { src: __dirname + '/public', compile: compile }
      ));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * DATABASE CONNECTION
 */
var Mongoose = require('mongoose');
var db = Mongoose.createConnection('localhost', 'teddybear');

// Construct models
var InventorySchema = require('./model/inventory.js').InventorySchema;
var Inventory = db.model('Inventory', InventorySchema);

// CONNECTION EVENTS
// When successfully connected
db.on('connected', function () {
	console.log('Mongoose default connection open to ' + app.get('port'));
  // Put a sample product into the database if there isn't one
  Inventory.count({}, function(error, count) {
    if (count == 0) {
      var ff = new Inventory({
        _id: 1,
        title : 'Fantastic Four',
        publisher : 'Marvel',
        writer : 'Jonathan Hickman',
        artist : 'Sean Chen',
        releaseDate : Date.now(),
        issue : 13,
        volume : 2,
        price : 2.99,
        image : 'fantastic-four.jpg',
        description : 'The fallout of Reed\'s machine results in Sue, Ben and Johnny finding themselves in the middle of a super hero Hyborian-age civil war, while Reed searches for answers to questions that can only be found in alternate timelines. Back on Earth, it\'s Val and Franklin versus the agents of H.A.M.M.E.R.!'
      }).save();
      var jl = new Inventory({
        _id: 2,
        title : 'Justice League of America',
        publisher : 'DC',
        writer : 'Joseph Loeb',
        artist : 'Jim Lee',
        releaseDate : Date.now(),
        issue : 3,
        volume : 2,
        price : 3.99,
        image : 'justice-league.jpg',
        description : 'As the battle for control over Gotham City escalates, a new protector rises. But first, it\'s the face-off you won\'t want to miss: Killer Croc vs. Bane!'
      }).save();
      var sm = new Inventory({
        _id: 3,
        title : 'The Amazing Spider-Man',
        publisher : 'Marvel',
        writer : 'Dan Slott',
        artist : 'Jose Ryp',
        releaseDate : Date.now(),
        issue : 700,
        volume : 1,
        price : 3.99,
        image : 'spider-man.jpg',
        description : 'Harley is set to begin her new life, but she needs a job first! Enter the Coney Island Roller Derby! It\'s game time as Harley sets out to destroy her competition - literally!'
      }).save();
    }
  });
});

// If the connection throws an error
db.on('error',function (err) {
	console.log('Mongoose default connection error: ' + err);
});
 
// When the connection is disconnected
db.on('disconnected', function () {
	console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  Mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/**
 * RESTful GET
 */
//app.get('/', routes.index(Inventory));
app.get('/', routes.index);
//app.get('/comics/:id', routes.comic);
app.get('/database/comics', function(req, res){
  Inventory.find(
    function(error, products) {
      if(error) console.log(error);
      //Simulate delay in server
      setTimeout(function(){console.log('READING COMICS IN INVENTORY');res.json(products);/*res.send(products)*/}, 1000);
  }); 
});
app.get('/database/comics/:id', function(req, res){
  Inventory.findOne({'_id' : req.params.id},function(error, item){
    if(error) console.log(error);
    var comic = {
      _id: item.id,
      title : item.title,
      publisher : item.publisher,
      writer : item.writer,
      artist : item.artist,
      releaseDate : item.releaseDate,
      issue : item.issue,
      volume : item.volume,
      price : item.price,
      image : item.image,
      description : item.description
    };
    //Simulate delay in server
    setTimeout(function(){res.send(comic);console.log('READING COMIC "' + item.title + '"'); }, 500);
  })
  
});
app.get('/partials/:name', routes.partials);
app.get('/users', user.list);

/**
 * RESTful POST
 */
app.post('/database/comics/:id', function(req, res){
  console.log('hello ' + req.files);
  res.send();
  /*var comic = new Inventory({
      _id: req.body._id,
      title : req.body.title,
      publisher : req.body.publisher,
      writer : req.body.writer,
      artist : req.body.artist,
      releaseDate : req.body.releaseDate,
      issue : req.body.issue,
      volume : req.body.volume,
      price : req.body.price,
      image : req.body.image,
      description : req.body.description
  })
  .save(function(error){
      if(error) console.log(error);
      //Simulate delay in server
      setTimeout(function(){res.send();console.log('CREATED NEW COMIC');}, 500);
  });*/
});
app.post('/upload', function(req, res){
  console.log('hello from upload');
  console.log(req.files.myFile);
  console.log(req.files.myFile.path);
  res.end();
});
/**
 * RESTful PUT
 */
app.put('/database/comics/:id', function(req, res){
  Inventory.update({_id:req.body._id}, {
    $set: {
      title : req.body.title,
      publisher : req.body.publisher,
      writer : req.body.writer,
      artist : req.body.artist,
      issue : req.body.issue,
      volume : req.body.volume,
      price : req.body.price,
      image : req.body.image,
      description : req.body.description
    }
  },
    function(error){
      if(error) console.log(error);
      //Simulate delay in server
      setTimeout(function(){res.send();console.log('UPDATED COMIC');}, 500); 
  });
});
/**
 * RESTful DELETE
 */
app.delete('/database/comics/:id', function(req, res){
  Inventory.findOne({'_id' : req.params.id},function(error, item){
    if(error) console.log(error);
    item.remove(function(error){
      setTimeout(function(){res.send();console.log('DELETED COMIC');}, 500);
    }); //Removes the document
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
