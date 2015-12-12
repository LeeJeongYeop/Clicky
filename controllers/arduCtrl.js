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
        var message = "success";
        async.waterfall([
                function(callback){  // 버튼 화인
                    db_btn.click(req.body.mac_addr, function(err, doc){
                        if(err){
                            message = "Button Check Error";
                            callback(err);
                        }else{
                            callback(null, doc);
                        }
                    });
                },
                function(doc, callback){
                    if(doc.fid == 1){  // 카운트 버튼 카운트 올리기
                        db_btn.countClick(req.body.mac_addr, function(err){
                            if(err){
                                message = "Count Button Click Error";
                                callback(err);
                            }else{
                                callback(null, doc);
                            }
                        });
                    }else if(doc.fid == 4) {  // Check 버튼 감소 시키기
                        if (doc.data.chk < 1) {
                            callback(null, doc);
                        } else {
                            var data = {
                                "mac_addr": req.body.mac_addr,
                                "chk": (doc.data.chk - 1)
                            };
                            db_btn.checkClick(data, function (err) {
                                if (err) {
                                    message = "Check Button Click Error";
                                    callback(err);
                                } else {
                                    callback(null, doc);
                                }
                            });
                        }
                    }else if(doc.fid == 5){  // Timer 버튼 상태 변환
                        var STATUS_CHANGE = -1;
                        var time_check = doc.data.time_check * STATUS_CHANGE;
                        var data = {
                            "mac_addr": req.body.mac_addr,
                            "time_check": time_check
                        };
                        db_btn.timerClick(data, function(err){
                            if(err){
                                message = "Timer Click Error";
                                callback(err);
                            }else{
                                callback(null, doc);
                            }
                        });
                    }else{
                        callback(null, doc);
                    }
                }
            ],
            function(err, doc){
                if(err){
                    return res.json({
                        "status": false,
                        "message": message
                    });
                }else{
                    my.gcm(req.body.mac_addr, doc._user.reg_id);
                    return res.json({
                        "status": true,
                        "message": message
                    });
                }
            }
        );  // waterfall
    }
};