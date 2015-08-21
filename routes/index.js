var express = require('express');
var router = express.Router();


/*******************
*  TEST
********************/
router.post('/', function(req, res, next) {
	console.log('IP : ', req.connection.remoteAddress);
	console.log('Request : ', req.body);
	return res.json({
		"result" : "success",
		"data": {
			"isPush" : req.body.isPush,
			"MACAddr" : req.body.MACAddr
		}
	})
});

module.exports = router;