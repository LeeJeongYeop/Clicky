/**
 * Created by kingw on 2015-09-17.
 */
var async = require('async');
var db_user = require('../models/userModel');
var db_crypto = require('../models/db_crypto');

/*******************
 *  User Join
 ********************/
exports.join = function(req, res){
    if(!req.body.id || !req.body.password || !req.body.reg_id){  // parameter check
        return res.json({
            "status": false,
            "message": "invalid parameter"
        });
    }else{
        async.waterfall([
                function(callback){
                    db_user.findOne({id: req.body.id}, function(err, user){
                        if(err){  // db error
                            console.error("user_join waterfall error 1: ", err);
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
                        "password": req.body.password,
                        "reg_id": req.body.reg_id
                    });
                    user.save(function(err, doc) {
                        if (err){
                            console.log("user_join waterfall error 2: ", err);
                            return callback(err);
                        }else callback(null);
                    });
                }
            ],
            function(err){
                if(err) return res.json({"status": false, "message": "Join ERROR"});
                else return res.json({"status": true, "message": "success"});
            }); // waterfall
    }
};

/*******************
 *  User Login
 ********************/
exports.login = function(req, res){
    if(!req.body.id || !req.body.password){  // parameter check
        return res.json({
            "status": false,
            "message": "invalid parameter"
        });
    }else{
        db_user.login(req.body.id, function(err, user){
            if(err){
                console.error("Login db error 1: ", err);
                return res.json({"status": false, "message": "Login error"});
            }else if(user.length == 0){
                return res.json({"status": false, "message": "Not join"});
            }else{
                if((req.body.id == user[0].id) && (db_crypto.do_ciper(req.body.password) == user[0].password)){
                    req.session.user = user[0].id;  // session 저장
                    return res.json({
                        "status": true,
                        "message": "success"
                    });
                }else{
                    return res.json({
                        "status": false,
                        "message": "not match"
                    });
                }
            }
        });
    }
};