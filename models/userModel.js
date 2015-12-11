/**
 * Created by kingw on 2015-09-17.
 */
var db = require('./db_config');
var db_crypto = require('./db_crypto');
var logger = require('../logger');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*******************
 *  User Schema
 ********************/
var UserSchema = new Schema({
    id: {type: String, required: true},
    password: {type: String, required: true},
    reg_id: {type: String, default: null},  // android regID
    create_at: {type: Date, default: Date.now}
});
UserSchema.index({ id: 1 }, { unique: true });

UserSchema.pre('save', function(callback){
    this.password = db_crypto.do_ciper(this.password);
    callback();
});

/*******************
 *  User Login
 ********************/
UserSchema.statics.login = function(id, callback){
    var self = this;
    self.findOne({id: id}, function(err, user){
        if(err) callback(err);
        else callback(null, user);
    });
};
UserSchema.statics.regUpdate = function(data, callback){
    var self = this;
    logger.info(data[0]);
    self.update({_id: data[0]}, {$set: {reg_id: data[1]}}, function(err){
        if(err) {
            logger.error("Login reg_id Update Error:", err);
            callback(err);
        }else{
            callback(null);
        }
    });
};

module.exports = db.model('User', UserSchema);