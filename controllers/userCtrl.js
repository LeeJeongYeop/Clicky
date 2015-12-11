/**
 * Created by kingw on 2015-09-17.
 */
var db_user = require('../models/userModel');
var db_crypto = require('../models/db_crypto');
var logger = require('../logger');
var async = require('async');

/*******************
 *  User Join
 ********************/
exports.join = function(req, res){  //TODO MC 구분해야함.
    if(!req.body.id || !req.body.password){  // parameter check
        return res.json({
            "status": false,
            "message": "invalid parameter"
        });
    }else{
        async.waterfall([
                function(callback){
                    db_user.findOne({id: req.body.id}, function(err, user){
                        if(err){  // db error
                            logger.error("user_join waterfall error 1: ", err);
                            return res.json({
                                "status": false,
                                "message": "DB ERROR"
                            });
                        }else if(user){  // id exists check
                            return res.json({
                                "status": false,
                                "message": "ID exists"
                            });
                        }else{  // success
                            callback(null);
                        }
                    })
                },
                function(callback){
                    var user = new db_user({
                        "id": req.body.id,
                        "password": req.body.password
                    });
                    user.save(function(err, doc) {
                        if (err){
                            logger.log("user_join waterfall error 2: ", err);
                            return callback(err);
                        }else callback(null);
                    });
                }
            ],
            function(err){
                if(err) return res.json({"status": false, "message": "Join ERROR"});
                else return res.json({"status": true, "message": "success"});
            }
        ); // waterfall
    }
};

/*******************
 *  User Login
 ********************/
exports.login = function(req, res){
    logger.info("req.body:", req.body);
    if(!req.body.id || !req.body.password || !req.body.reg_id){  // parameter check
        return res.json({
            "status": false,
            "message": "invalid parameter"
        });
    }else{
        db_user.login(req.body.id, function(err, user){
            if(err){
                logger.error("Login db error 1: ", err);
                return res.json({"status": false, "message": "Login error"});
            }else if(!user){
                return res.json({"status": false, "message": "Not join"});
            }else{
                if((req.body.id == user.id) && (db_crypto.do_ciper(req.body.password) == user.password)){
                    var data = [user._id, req.body.reg_id];
                    db_user.regUpdate(data, function(err){
                        if(err){
                            return res.json({"status": false, "message": "Login error"});
                        }else{
                            req.session.user = user._id;  // session 저장
                            return res.json({
                                "status": true,
                                "message": "success"
                            });
                        }
                    });
                }else{
                    return res.json({
                        "status": false,
                        "message": "Not match"
                    });
                }
            }
        });
    }
};

/*******************
 *  Login Required
 ********************/
exports.loginRequired = function(req, res, next){
    if(req.session.user) next();
    else return res.json({"status": false, "message": "Not Login"});
};