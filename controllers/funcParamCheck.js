/**
 * Created by kingw on 2015-12-05.
 */

exports.paramCheck = function(req, res, next){
    if (!req.body.mac_addr || !req.body.fid || !req.body.title) {  // parameter check
        return res.json({
            "status": false,
            "message": "invalid parameter"
        });
    }else{  // func parameter check
        switch (req.body.fid) {
            case "1":
                next();
                break;
            case "2":
                if(!req.body.start || !req.body.end){
                    return res.json({
                        "status": false,
                        "message": "invalid parameter"
                    });
                }else{
                    next();
                }
                break;
            case "3":
                next();break;
            case "4":
                if(!req.body.chk){
                    return res.json({
                        "status": false,
                        "message": "invalid parameter"
                    });
                }else{
                    next();
                }
                break;
            case "5":
                if(!req.body.time){
                    return res.json({
                        "status": false,
                        "message": "invalid parameter"
                    });
                }else{
                    next();
                }
                break;
            case "6":
                if(!req.body.content){
                    return res.json({
                        "status": false,
                        "message": "invalid parameter"
                    });
                }else{
                    next();
                }
                break;
            default :
                return res.json({
                    "status": false,
                    "message": "invalid parameter"
                });
                break;
        }
    }
};