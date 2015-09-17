/**
 * Created by kingw on 2015-09-16.
 */
var userCtrl = require('../controllers/userCtrl');

exports.initApp = function(app){
    // USER
    app.route('/user/join')
        .post(userCtrl.join);
};