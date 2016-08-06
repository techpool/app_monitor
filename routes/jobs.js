var express = require('express');
var router = express.Router();
var rs = require('random-strings');
var async = require('async');

// Models
var channel_model = require('../models/channel.js');


router.post('/create', function(req, res, next) {
	if (!req.user) {
		res.redirect('/users/login');
	} else {

		console.log(req.body)
		
		var info = req.body;
		var flag = true;
		var channel_token = "";

		async.forever(
			function(next) {
				channel_token = rs.base64(20);

				channel_model.findOne({
					token: channel_token
				}).exec(function(err, channel) {
					if (err) {
						console.log(err);
					} else if(channel){
						next();
					} else {
						next(1);
					}
				});

			}, function(err) {

				var channel = new channel_model({
					_user: req.user._id,
					token: channel_token,
					grace: info.grace,
					limit: info.limit,
					job_name: info.job_name
				});

				channel.save(function(err, savedObj) {
					if (err) {
						console.log(err);
					} else {
						res.json({
							token: channel_token
						});
					}
				});

			}
		);
	}
})

// TODO: This is to be deleted once the frontend goes up and running
// with AJAX calls for post request
router.get('/create', function(req, res, next) {
	res.render('job_form', {title: 'Create Job'});
})

router.get('/:token/complete', function(req, res, next) {

	channel_model.findOne({
		token: req.params.token
	}).exec(function(err, channel) {
		if (err) {
			console.log(err);
		} else if(channel){
			var ping_time = Date.now();
			channel.success_pings.push(ping_time);
			channel.last_success_ping = ping_time;
			channel.save(function(err, savedObj) {
				if (err) {
					console.log(err);
				} else {
					res.json({
						msg: 'Job Completed',
						ping_time: ping_time
					});
				}
			});
		}
	});
});

router.get('/:token/error', function(req, res, next) {
	channel_model.findOne({
		token: req.params.token
	}).exec(function(err, channel) {
		if (err) {
			console.log(err);
		} else if(channel){
			var ping_time = Date.now();
			channel.failed_pings.push(ping_time);
			channel.last_failed_ping = ping_time;
			channel.save(function(err, savedObj) {
				if (err) {
					console.log(err);
				} else {
					res.json({
						msg: 'Error',
						ping_time: ping_time
					});
				}
			});
		}
	});
});

router.get('/', function(req, res, next) {

	if (!req.user) {
		res.redirect('/users/login');
		next();
	}

	var query = req.query;
	var limit = 0;
	if (query.limit) {
		limit = Number(query.limit);
	}

	channel_model.find({
		_user: req.user._id
	}).limit(limit).exec(function(err, channelLists) {
		if (err) {
			console.log(err);
		} else {
			res.json(channelLists);
		}
	})
});

module.exports = router;
