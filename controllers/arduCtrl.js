/**
 * Created by kingw on 2015-12-05.
 */
var db_btn = require('../models/btnModel');
var my = require('../my_conf');
var logger = require('../logger');
var async = require('async');

/*******************
 *  Btn Click (arduino)
 ********************/
exports.click = function(req, res){
    if(!req.body.mac_addr){   // parameter check
        return res.json({
            "status": false,
            "message": "invalid parameter"
        });
    }else{
        var data = {
            "mac_addr": req.body.mac_addr
        };
        db_btn.click(data, function(status, meesage, doc){
            if(status){
                logger.info("reg_id:", doc._user.reg_id);
                my.gcm(req.body.mac_addr, doc._user.reg_id);
            }
            return res.json({
                "status": status,
                "message": meesage
            });
        });
    }
};