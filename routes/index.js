var express = require('express');
var router = express.Router();
var my = require('../my_conf');


/*******************
*  TEST
********************/
router.post('/clicky', function(req, res) {
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

/*******************
 *  GCM TEST
 ********************/
router.post('/clicky/gcm', function(req, res){
    console.log('req.body:', req.body);
    my.gcm(req.body.msg, req.body.regId);
    return res.json({
        "result" : "success"
    });
});

module.exports = router;