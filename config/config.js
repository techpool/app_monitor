var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var session = require('express-session')
var flash = require('connect-flash');

// Models
var User = require('../models/user.js');

module.exports = function (app, express) {
	
	// uncomment after placing your favicon in /public
	//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(cookieParser());
	app.use(flash());

	app.use(session({
		secret: 'thisisa complete random key, pamelapamela',
		resave: true,
    	saveUninitialized: true
	}));
	app.use(passport.initialize());
	app.use(passport.session());

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	passport.use(new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password'
		},
		function(email, password, done) {
			User.findOne({ email: email }, function (err, user) {
				if (err) {
					return done(err);
				}
				if (!user) {
					return done(null, false, { message: 'Incorrect username.' });
				}
				user.validatePassword(password, function(err, isMatch) {
					if (err) {
						return done(err);
					} else {
						if (isMatch) {
							return done(null, user);
						} else {
							return done(null, false, { message: 'Incorrect password.' });
						}
					}
				});
			});
		}
	));

	// DB Connector
	
	mongoose.connect(app.get('dbpath'));
	
	var db = mongoose.connection;
	
	db.on('error', console.error.bind(console, 'connection error:'));
		db.once('open', function() {
			console.log('DB Connected Successfully.')
	});



}