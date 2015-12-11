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
 *  Button Delete
 ********************/
exports.list = function(req, res){
    db_btn.list(req.session.user, function(err, doc){
        var status = true;
        var message = "success";
        if(err){
            status = false;
            message = "Button Get List Fail";
            doc = null;
        }
        return res.json({
            "status": status,
            "message": message,
            "data": doc
        });
    });
};

/*******************
 *  Button Delete
 ********************/
exports.delete = function(req, res){
    if (!req.body.mac_addr) {  // parameter check
        return res.json({
            "status": false,
            "message": "invalid parameter"
        });
    } else {
        var data = {
            "_user": req.session.user,
            "mac": req.body.mac_addr
        };
        async.waterfall([
                function(callback){
                    db_btn.deleteCheck(data, function(err, doc){
                        if(err) callback(err);
                        else if(!doc) return res.json({"status": false, "message": "No reg button"});  // 등록된 버튼 없음
                        else callback(null);
                    });
                },
                function(callback){
                    db_btn.delete(data, function(err){
                        if(err) callback(err);
                        else callback(null);
                    });
                }
            ],
            function(err){
                if(err) return res.json({"status": false, "message": "Button delete error"});
                else return res.json({"status": true, "message": "success"});
            }
        );  // waterfall
    }
};

/*******************
 *  Btn Func Reg
 ********************/
exports.funcReg = function(req, res) {
    logger.info("req.body:", req.body);
    var _user = req.session.user;
    async.waterfall([
            function (callback) {
                var data = {
                    "_user": _user,
                    "mac_addr": req.body.mac_addr
                };
                db_btn.btnFuncCheck(data, function (err, doc) {
                    if (err) callback(err);
                    else if(!doc) res.json({"status": false, "message": "No reg button"});  // 등록된 버튼이 없음
                    else callback(null);
                });
            },
            function (callback) {
                switch (req.body.fid){
                    case "1":  // Count
                        db_btn.countReg(_user, req.body, function (err) {
                            if(err){ callback(err); }
                            else{ callback(null); }
                        });break;
                    case "2":  // Alarm
                        db_btn.alarmReg(_user, req.body, function (err) {
                            if(err){ callback(err); }
                            else{ callback(null); }
                        });break;
                    case "3":  // StopWatch
                        db_btn.stopwatchReg(_user, req.body, function (err) {
                            if(err){ callback(err); }
                            else{ callback(null); }
                        });break;
                    case "4":  // Check
                        db_btn.checkReg(_user, req.body, function (err) {
                            if(err){ callback(err); }
                            else{ callback(null); }
                        });break;
                    case "5":  // Timer
                        db_btn.timerReg(_user, req.body, function (err) {
                            if(err){ callback(err); }
                            else{ callback(null); }
                        });break;
                    case "6":  // Message
                        db_btn.msgReg(_user, req.body, function (err) {
                            if(err){ callback(err); }
                            else{ callback(null); }
                        });break;
                    default :
                        logger.error("Bad fid");
                        callback("Bad fid");break;
                }
            }
        ],
        function (err) {
            if (err) return res.json({"status": false, "message": "Button func reg error"});
            else return res.json({"status": true, "message": "success"});
        }
    );  // waterfall
};

/*******************
 *  Btn Func View
 ********************/
exports.funcView = function(req, res) {
    if (!req.params.mac_addr) {  // parameter check
        return res.json({
            "status": false,
            "message": "invalid parameter"
        });
    } else {
        var data = {
            "_user": req.session.user,
            "mac_addr": req.params.mac_addr
        };
        db_btn.btnFuncCheck(data, function (err, doc) {  // 버튼 기능 있는지 확인하는 model 이용
            var status = false,
                message = "error",  // default err
                data = null;
            if (err) {
                message = "Button func view error"
            }else if(!doc){  // 등록된 버튼이 없음
                message = "Not found Button"
            }else if(doc.fid == 0){
                message = "Not register Button's function"
            }else{
                status = true;
                message = "success";
                data = {
                    "title": doc.title,
                    "fid": doc.fid,
                    "info": doc.data
                }
            }
            return res.json({
                "status": status,
                "message": message,
                "data": data
            });
        });
    }
};

/*******************
 *  Btn Func Delete
 ********************/
exports.funcDelete = function(req, res) {
    if (!req.body.mac_addr) {  // parameter check
        return res.json({
            "status": false,
            "message": "invalid parameter"
        });
    } else {
        logger.info("req.body:", req.body);
        var data = {
            "_user": req.session.user,
            "mac_addr": req.body.mac_addr
        }
        async.waterfall([
                function (callback) {
                    db_btn.btnFuncCheck(data, function (err, doc) {
                        if (err) callback(err);
                        else if(!doc) res.json({"status": false, "message": "No reg button"});  // 등록된 버튼이 없음
                        else if (doc.fid == 0) res.json({"status": false, "message": "Already not reg Function"});  // 이미 기능이 없는 버튼
                        else callback(null);
                    });
                },
                function (callback) {
                    db_btn.funcDelete(data, function (err) {
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

/*******************
 *  Count Reset
 ********************/
exports.countReset = function(req, res){
    if (!req.body.mac_addr) {  // parameter check
        return res.json({
            "status": false,
            "message": "invalid parameter"
        });
    } else {
        var data = {
            "_user": req.session.user,
            "mac_addr": req.body.mac_addr
        };
        async.waterfall([
                function(callback){
                    db_btn.btnFuncCheck(data, function (err, doc) {
                        if (err){
                            callback(err, "Button Function Check Error");
                        }else if (!doc){
                            res.json({"status": false, "message": "No reg button"});  // 등록된 버튼이 없음
                        }else if (doc.fid == 0 || doc.fid != 1){
                            res.json({
                                "status": false,
                                "message": "Not match or No reg Function"
                            }); // 기능이 없는 버튼이거나 Count 버튼이 아님
                        }else{
                            callback(null);
                        }
                    });
                },
                function(callback){
                    db_btn.countReset(data, function(err){
                        if(err){
                            callback(err, "Counter Reset Error");
                        }else{
                            callback(null, "success");
                        }
                    });
                }
            ],
            function(err, message){
                var status = true;
                if(err){
                    status = false;
                }
                return res.json({
                    "status": status,
                    "message": message
                });
            }
        );  // waterfall
    }
};

/*******************
 *  Check Reset
 ********************/
exports.checkReset = function(req, res){
    if (!req.body.mac_addr) {  // parameter check
        return res.json({
            "status": false,
            "message": "invalid parameter"
        });
    } else {
        var data = {
            "_user": req.session.user,
            "mac_addr": req.body.mac_addr
        };
        async.waterfall([
                function(callback){
                    db_btn.btnFuncCheck(data, function (err, doc) {
                        if (err){
                            callback(err, "Button Function Check Error");
                        }else if (!doc){
                            res.json({"status": false, "message": "No reg button"});  // 등록된 버튼이 없음
                        }else if (doc.fid == 0 || doc.fid != 4){
                            res.json({
                                "status": false,
                                "message": "Not match or No reg Function"
                            }); // 기능이 없는 버튼이거나 Check 버튼이 아님
                        }else{
                            callback(null, doc.data.chk_max);
                        }
                    });
                },
                function(chk_max, callback){
                    db_btn.checkReset(data, chk_max, function(err){
                        if(err){
                            callback(err, "Counter Reset Error");
                        }else{
                            callback(null, "success");
                        }
                    });
                }
            ],
            function(err, message){
                var status = true;
                if(err){
                    status = false;
                }
                return res.json({
                    "status": status,
                    "message": message
                });
            }
        );  // waterfall
    }
};