/**
 * Created by kingw on 2015-09-17.
 */
var db = require('./db_config');
var db_crypto = require('./db_crypto');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*******************
 *  User Schema
 ********************/
var UserSchema = new Schema({
    id: {type: String, required: true},
    password: {type: String, required: true},
    reg_id: {type: String, required: true},  // android regID
    create_at: {type: Date, default: Date.now}
});
UserSchema.index({ id: 1 }, { unique: true });

UserSchema.pre('save', function(callback){
    this.password = db_crypto.do_ciper(this.password);
    callback();
});

module.exports = db.model('User', UserSchema);