/**
 * Created by kingw on 2015-09-19.
 */
var db = require('./db_config');
var mongoose = require('mongoose');
var logger = require('../logger');
var async = require('async');
var Schema = mongoose.Schema;

/*******************
 *  Button Schema
 ********************/
var ButtonSchema = new Schema({
    mac_addr: {type: String, required: true},
    fid: {type: Number, default: 0},  // 1)타이머,2)알람,3)스톱워치,4)체커,5)타이머,6)메세지
    title: {type: String, default: null},
    data: {
        cnt: Number,        // 1) 카운터
        start: String,      // 2) 알람
        end: String,        // 2) 알람
        chk_max: Number,    // 4) 체크
        chk: Number,        // 4) 체크
        time: String,       // 5) 타이머
        time_check: Number, // 5) 타이머(-1:정지상태, 1:시작상태)
        time_max: String,   // 5) 타이머
        content: String     // 6) 메세지
    },
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
 *  Button Delete
 ********************/
ButtonSchema.statics.deleteCheck = function(data, callback){
    var self = this;
    self.findOne({$and:[{_user: data._user}, {mac_addr: data.mac}]}, function(err, doc){
        if(err){
            logger.error("btn deleteCheck error: ", err);
            callback(err);
        }
        else callback(null, doc);
    });
};
ButtonSchema.statics.delete = function(data, callback){
    var self = this;
    self.remove({$and:[{_user: data._user}, {mac_addr: data.mac}]}, function(err){
        if(err){
            logger.error("btn delete error: ", err);
            callback(err);
        }
        else callback(null);
    });
};

/*******************
 *  Button List
 ********************/
ButtonSchema.statics.list = function(user, callback){
    var self = this;
    logger.info("data", user);
    self.find({_user: user})
        .select({"_id": 0, "mac_addr": 1, "title": 1, "fid": 1})
        .exec(function(err, doc){
            if(err){
                logger.error("btn deleteCheck error: ", err);
                callback(err);
            }
            else callback(null, doc);
        });
};

/*******************
 *  Btn Func Check
 ********************/
ButtonSchema.statics.btnFuncCheck = function(data, callback){
    var self = this;
    self.findOne({$and:[{_user: data._user}, {mac_addr: data.mac_addr}]}, function(err, doc) {
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
ButtonSchema.statics.countReg = function(_user, data, callback){
    var self = this;
    var DEFAULT_COUNT = 0;
    self.update(
        {$and:[{_user: _user}, {mac_addr: data.mac_addr}]},
        {$set: {fid: data.fid, title: data.title, data: {cnt: DEFAULT_COUNT}}},
        function(err){
            if(err){
                logger.error("btn funcReg error : ", err);
                callback(err);
            }
            else { callback(null); }
        }
    );
};
ButtonSchema.statics.alarmReg = function(_user, data, callback){
    var self = this;
    self.update(
        {$and:[{_user: _user}, {mac_addr: data.mac_addr}]},
        {$set: {fid: data.fid, title:data.title, data: {start: data.start, end: data.end}}},
        function(err){
            if(err){
                logger.error("btn funcReg error : ", err);
                callback(err);
            }
            else { callback(null); }
        }
    );
};
ButtonSchema.statics.stopwatchReg = function(_user, data, callback){
    var self = this;
    self.update(
        {$and:[{_user: _user}, {mac_addr: data.mac_addr}]},
        {$set: {fid: data.fid, title:data.title, data:{}}},
        function(err){
            if(err){
                logger.error("btn funcReg error : ", err);
                callback(err);
            }
            else { callback(null); }
        }
    );
};
ButtonSchema.statics.checkReg = function(_user, data, callback){
    var self = this;
    self.update(
        {$and:[{_user: _user}, {mac_addr: data.mac_addr}]},
        {$set: {fid: data.fid, title:data.title, data: {chk: data.chk, chk_max: data.chk}}},
        function(err){
            if(err){
                logger.error("btn funcReg error : ", err);
                callback(err);
            }
            else { callback(null); }
        }
    );
};
ButtonSchema.statics.timerReg = function(_user, data, callback){
    var self = this;
    var DEFAULT = -1;
    self.update(
        {$and:[{_user: _user}, {mac_addr: data.mac_addr}]},
        {$set: {fid: data.fid, title:data.title,
            data: {time: data.time, time_max: data.time, time_check: DEFAULT}}},
        function(err){
            if(err){
                logger.error("btn funcReg error : ", err);
                callback(err);
            }
            else { callback(null); }
        }
    );
};
ButtonSchema.statics.msgReg = function(_user, data, callback){
    var self = this;
    self.update(
        {$and:[{_user: _user}, {mac_addr: data.mac_addr}]},
        {$set: {fid: data.fid, title:data.title, data: {content: data.content}}},
        function(err){
            if(err){
                logger.error("btn funcReg error : ", err);
                callback(err);
            }
            else { callback(null); }
        }
    );
};

/*******************
 *  Btn Func Delete
 ********************/
ButtonSchema.statics.funcDelete = function(data, callback){
    var self = this;
    var DELETE = 0;
    self.update({$and:[{_user: data._user}, {mac_addr: data.mac_addr}]},
        {$set: {fid: DELETE, title: null, data: {}}},
        function(err){
            if(err){
                logger.error("btn funcDelete error : ", err);
                callback(err);
            }
            else callback(null);
        });
};

/*******************
 *  Count Reset
 ********************/
ButtonSchema.statics.countReset = function(data, done){
    var self = this;
    var RESET = 0;
    self.update({$and:[{_user: data._user}, {mac_addr: data.mac_addr}]},
        {$set: {"data.cnt": RESET}},
        function(err){
            if(err){
                logger.error("Count Reset Error : ", err);
                done(err);
            }else{
                done(null);
            }
        });
};

/*******************
 *  Check Reset
 ********************/
ButtonSchema.statics.checkReset = function(data, chk_max, done){
    var self = this;
    self.update({$and:[{_user: data._user}, {mac_addr: data.mac_addr}]},
        {$set: {"data.chk": chk_max}},
        function(err){
            if(err){
                logger.error("Check Reset Error : ", err);
                done(err);
            }else{
                done(null);
            }
        });
};

/*******************
 *  Timer Update
 ********************/
ButtonSchema.statics.timerUpdate = function(data, done){
    var self = this;
    self.update({$and:[{_user: data._user}, {mac_addr: data.mac_addr}]},
        {$set: {"data.time": data.time}},
        function(err){
            if(err){
                logger.error("Timer Update Error : ", err);
                done(err);
            }else{
                done(null);
            }
        });
};

/*******************
 *  Timer Reset
 ********************/
ButtonSchema.statics.timerReset = function(data, time_max, done){
    var self = this;
    var DEFAULT = -1;
    self.update({$and:[{_user: data._user}, {mac_addr: data.mac_addr}]},
        {$set: {"data.time": time_max, "data.time_check": DEFAULT}},
        function(err){
            if(err){
                logger.error("Timer Reset Error : ", err);
                done(err);
            }else{
                done(null);
            }
        });
};

/*******************
 *  Btn Click (arduino)
 ********************/
ButtonSchema.statics.click = function(mac_addr, done){
    var self = this;
    self.findOne({mac_addr: mac_addr})
        .populate('_user')
        .exec(function(err, doc){
            if(err){
                logger.error("btn click(arduino) error_1 : ", err);
                done(err);
            }else{
                if(doc){
                    done(null, doc);
                }else{
                    logger.error("btn click(arduino) Not register Button");
                    done("Not register Button");
                }
            }
        });
};

/*******************
 *  Count Btn Click (arduino)
 ********************/
ButtonSchema.statics.countClick = function(mac_addr, done){
    var self = this;
    self.update({mac_addr: mac_addr}, {$inc: {"data.cnt": 1}}, function(err){
        if(err){
            logger.error("Count Click inc error:", err);
            done(err);
        }else{
            done(null);
        }
    });
};

/*******************
 *  Check Btn Click (arduino)
 ********************/
ButtonSchema.statics.checkClick = function(data, done){
    var self = this;
    self.update({mac_addr: data.mac_addr}, {$set: {"data.chk": data.chk}}, function(err){
        if(err){
            logger.error("Check Click inc error:", err);
            done(err);
        }else{
            done(null);
        }
    });
};

/*******************
 *  Timer Btn Click (arduino)
 ********************/
ButtonSchema.statics.timerClick = function(data, done){
    var self = this;
    self.update({mac_addr: data.mac_addr}, {$set: {"data.time_check": data.time_check}}, function(err){
        if(err){
            logger.error("Timer Click error:", err);
            done(err);
        }else{
            done(null);
        }
    });
};

module.exports = db.model('Button', ButtonSchema);