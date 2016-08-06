var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	console.log(req.user);
	res.render('dashboard', { title: 'Dashboard' });
});

module.exports = router;
