/**
 * Created by kingw on 2015-09-19.
 */
var db_btn = require('../models/btnModel');
var logger = require('../logger');
var async = require('async');

/*******************
 *  Button Registration
 ********************/
exports.reg = function(req, res){
    if(!req.body.mac_addr) {  // parameter check
        return res.json({
            "status": false,
            "message": "invalid parameter"
        });
    }else{
        var data = {
            "_user": req.session.user,
            "mac": req.body.mac_addr
        };
        async.waterfall([
                function(callback){
                    db_btn.regCheck(data, function(err, doc){
                        if(err) callback(err);
                        else if(doc) return res.json({"status": false, "message": "Button exists"});  // 이미 등록된 button
                        else callback(null);
                    });
                },
                function(callback){
                    db_btn.reg(data, function(err){
                        if(err) callback(err);
                        else callback(null);
                    });
                }
            ],
            function(err){
                if(err) return res.json({"status": false, "message": "Button reg error"});
                else return res.json({"status": true, "message": "success"});
            }
        );  // waterfall
    }
};

/*******************
 *  Btn Func Reg
 ********************/
exports.funcReg = function(req, res) {
    if (!req.body.mac_addr || !req.body.func_id) {  // parameter check
        return res.json({
            "status": false,
            "message": "invalid parameter"
        });
    } else {
        var data = {
            "_user": req.session.user,
            "mac": req.body.mac_addr,
            "func": req.body.func_id
        };
        async.waterfall([
                function (callback) {
                    db_btn.funcRegCheck(data, function (err, doc) {
                        if (err) callback(err);
                        else if(!doc) res.json({"status": false, "message": "No reg button"});  // 등록된 버튼이 없음
                        else if (doc.func != 0) res.json({"status": false, "message": "Function exists"});  // 기능이 등록된 button
                        else callback(null);
                    });
                },
                function (callback) {
                    db_btn.funcReg(data, function (err) {
                        if (err) callback(err);
                        else callback(null);
                    });
                }
            ],
            function (err) {
                if (err) return res.json({"status": false, "message": "Button func reg error"});
                else return res.json({"status": true, "message": "success"});
            }
        );  // waterfall
    }
};