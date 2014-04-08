/**
 * Module dependencies.
 */
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var stylus = require('stylus');
var nib = require('nib');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');

/**
 * DATABASE CONNECTION
 */
var Mongoose = require('mongoose');
var db = Mongoose.createConnection('localhost', 'blackholecomics');

//USER Schema and model
var UserSchema = new Mongoose.Schema({
	_id : String,
	password : String,
	email : String,
	admin : Boolean,
	avatar : String,
	created : Date,
	personal : {
		name : String,
		address : {
			street : String,
			apartment : String,
			city : String,
			state : String,
			zipcode : Number,
			billing : Boolean
		},
		payment : {
			card : String,
			ccNumber : Number,
			expiration : Date,
			security : Number
		}
	}
});

UserSchema.pre('save', function(next){
	var user = this;
	var salt = bcrypt.genSaltSync();
    var hash = bcrypt.hashSync(user.password, salt);
    user.password = hash;
	next();
});

var UsersCollection = db.model('users', UserSchema);
//==================================================================
// Define the strategy to be used by PassportJS
passport.use(new LocalStrategy(
	function(username, password, done){
		UsersCollection.findOne({_id : username},function(error,user){
			var verify = bcrypt.compareSync(password, user.password);
			if(error) return done(error);
			if(!user) return done(null,false,{message:'Incorrect username.'});
			//if(password !== user.password) return done(null,false,{message:'Incorrect password.'})
			if(!verify) return done(null,false,{message:'Incorrect password.'});
			return done(null,user);
		})
	}
));
// Serialized and deserialized methods when got from session
passport.serializeUser(function(user,done){
	done(null, user);
});
passport.deserializeUser(function(user,done){
	done(null, user);
});
// Define a middleware function to be used for every secured routes
var auth = function(req, res, next){
	if(!req.isAuthenticated()){
		res.send(401);
	}else{
		next();
	};
};
////////////////////////////////////////////////////////////////////////////////



var app = express();

// for stylus
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
//cookie for authentication, body parser for form data.
app.use(express.cookieParser());
app.use(express.bodyParser());
//////////////////////////////////////
app.use(express.methodOverride());
//Session and authentication middleware
app.use(express.session({secret : 'killpixel'}))
app.use(passport.initialize());
app.use(passport.session());
//////////////////////////////////////
app.use(app.router);
//stylus middleware
app.use(stylus.middleware({ src: __dirname + '/public', compile: compile }));
app.use(express.static(path.join(__dirname, 'public')));


// CONNECTION EVENTS
// When successfully connected
db.on('connected', function () {
	console.log('Mongoose default connection open to ' + app.get('port'));
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

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);
//app.get('/users', user.list);
app.get('/users', auth, function(req, res){
  res.send([{name: "user1"}, {name: "user2"}]);
});
app.get('/loggedin', function(req, res){
	res.send(req.isAuthenticated() ? req.user : '0');
});
app.get('/login',function(req,res){
	res.send();
});
app.get('/signup',function(req,res){
	res.send();
});
app.get('/account', auth, function(req,res){
	res.send();
});


app.post('/login', passport.authenticate('local'), function(req,res){
	console.log(req.body)
	console.log(req.user)
	res.send(req.user);
});
app.post('/logout', function(req,res){
	req.logOut();
  	res.send(200);
})
app.post('/signup', function(req, res){
	var newUser = new UsersCollection({
		_id : req.body.username,
		password : req.body.password,
		admin : false,
		created : Date.now()
	})
	.save(function(error,user){
      if(error) console.log(error);
      //Simulate delay in server
      setTimeout(
      	function(){
      		console.log("SIGNUP : " + user)
      		req.login(user, function(error){
      			if(error) console.log(error);
      			console.log('CREATED NEW USER');
      			res.send();
      		});
      	}
      	, 500);
  	})
	
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
