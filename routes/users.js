var express = require('express');
var router = express.Router();
var passport = require('passport')

// Model
var user_model = require('../models/user.js');

redirects = { 
	successRedirect: '/dashboard',
	failureRedirect: '/users/login',
	failureFlash : true
}

router.get('/login', function(req, res, next) {
	res.render('login', {title: 'Login'});
});

router.post('/login',
	passport.authenticate('local', redirects),
	function(req, res, next){
		var body = req.body;
		console.log(body);
		res.send('thanks')
})

router.get('/register', function(req, res, next) {
	res.render('register', {title: 'Registration'});
});

router.post('/register',
	function(req, res, next){
		var body = req.body;
		
		var user_obj = new user_model({
			email: body.email,
			name: {
				firstname: body.fname,
				lastname: body.lname
			},
			password: body.password
		})

		user_obj.save(function(err, savedObj) {
			if (err) {
				next(err);
			} else {
				res.send('thanks');
			}
		});
});

module.exports = router;
