/**
 * Created by kingw on 2015-09-19.
 */
var db = require('./db_config');
var logger = require('../logger');
var async = require('async');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*******************
 *  Button Schema
 ********************/
var ButtonSchema = new Schema({
    mac_addr: {type: String, required: true},
    func: {type: Number, default: 0},
    _user: {type: String, ref: "User"},
    create_at: {type: Date, default: Date.now}
});

/*******************
 *  Button Registration
 ********************/
ButtonSchema.statics.regCheck = function(data, callback){
    var self = this;
    self.findOne({$and:[{_user: data._user}, {mac_addr: data.mac}]}, function(err, doc){
        if(err){
            logger.error("btn regCheck error: ", err);
            callback(err);
        }
        else callback(null, doc);
    });
};

ButtonSchema.statics.reg = function(data, callback){
    var self = this;
    var button = new self({
        "_user": data._user,
        "mac_addr": data.mac
    });
    button.save(function(err){
        if(err){
            logger.error("btn reg error: ", err);
            callback(err);
        }
        else callback(null);
    });
};

/*******************
 *  Btn Func Check
 ********************/
ButtonSchema.statics.btnFuncCheck = function(data, callback){
    var self = this;
    self.findOne({$and:[{_user: data._user}, {mac_addr: data.mac}]}, function(err, doc) {
        if (err) {
            logger.error("btn Func Check error : ", err);
            callback(err);
        }
        else callback(null, doc);
    });
};

/*******************
 *  Btn Func Reg
 ********************/
ButtonSchema.statics.funcReg = function(data, callback){
    var self = this;
    self.update({_user: data._user}, {$set: {func: data.func}}, function(err){
        if(err){
            logger.error("btn funcReg error : ", err);
            callback(err);
        }
        else callback(null);
    });
};

/*******************
 *  Btn Func Modify
 ********************/
ButtonSchema.statics.funcModify = function(data, callback){
    var self = this;
    self.update({_user: data._user}, {$set: {func: data.func}}, function(err){
        if(err){
            logger.error("btn funcModify error : ", err);
            callback(err);
        }
        else callback(null);
    });
};
module.exports = db.model('Button', ButtonSchema);