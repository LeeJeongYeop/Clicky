/**
 * Created by kingw on 2015-09-16.
 */
var userCtrl = require('../controllers/userCtrl');
var btnCtrl = require('../controllers/btnCtrl');
var arduCtrl = require('../controllers/arduCtrl');
var funcParamCheck = require('../controllers/funcParamCheck');

exports.initApp = function(app){
    // USER
    app.route('/clicky/user/join')
        .post(userCtrl.join);
    app.route('/clicky/user/login')
        .post(userCtrl.login);

    // BUTTON
    app.route('/clicky/btn')
        .get(userCtrl.loginRequired, btnCtrl.list)
        .post(userCtrl.loginRequired, btnCtrl.reg)
        .delete(userCtrl.loginRequired, btnCtrl.delete);
    app.route('/clicky/btn/func')
        .post(userCtrl.loginRequired, funcParamCheck.paramCheck, btnCtrl.funcReg)
        .delete(userCtrl.loginRequired, btnCtrl.funcDelete);
    app.route('/clicky/btn/func/:mac_addr')
        .get(userCtrl.loginRequired, btnCtrl.funcView);
    app.route('/clicky/btn/func/count')
        .put(userCtrl.loginRequired, btnCtrl.countReset);
    app.route('/clicky/btn/func/check')
        .put(userCtrl.loginRequired, btnCtrl.checkReset);

    // ARDUINO
    app.route('/clicky/ardu/click')
        .post(arduCtrl.click);
};