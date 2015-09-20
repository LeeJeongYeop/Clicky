/**
 * Created by kingw on 2015-09-16.
 */
var userCtrl = require('../controllers/userCtrl');
var btnCtrl = require('../controllers/btnCtrl');

exports.initApp = function(app){
    // USER
    app.route('/user/join')
        .post(userCtrl.join);
    app.route('/user/login')
        .post(userCtrl.login);

    // BUTTON
    app.route('/btn')
        .post(userCtrl.loginRequired, btnCtrl.reg)
        .delete(userCtrl.loginRequired, btnCtrl.delete);
    app.route('/btn/func')
        .post(userCtrl.loginRequired, btnCtrl.funcReg)
        .put(userCtrl.loginRequired, btnCtrl.funcModify)
        .delete(userCtrl.loginRequired, btnCtrl.funcDelete);
};