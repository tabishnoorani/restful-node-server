import jwt from 'jsonwebtoken';
import UUID from 'node-uuid';
import config from '../../config';
import Session from '../../database/models/session';
import User from '../../database/models/username';

export function getTokenValue (req, res, next) {
    req.token = false;
    req.validToken = false;
    req.session = "";
    
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        jwt.verify(req.token, config.jwt.SECRET_KEY, function (err, data){
            if (err) {req.validToken = false} else {
                req.validToken = true;
                req.session = data;
            } 
        })
        next();
    } else {
        req.token = false;
        next();
    }
}

export function validSession (req, res, next) {
    req.validSession = false;
        const {uid, sid} =  (req.session.unsignedToken)
                            ?req.session.unsignedToken : {uid:"",sid:""};
        Session.findById(sid, (err, data)=>{
            if (data && !err){
                if (data.uid == uid) {
                    req.uid=uid;
                    req.sid=sid;
                    req.validSession = true;
                    next();
                } else res.send({success: false, msg:"Not authorized"});
            }else res.send({success: false, msg:"Not authorized"});
        });
}

export function addAllID (req, res, next) {
    const {uid} = req;
    User.findById(uid)
    .exec((err, user)=>{
        if (err) res.send({success: false, msg: 'Contact Web Admin', errCode: 'addallid-000'});
        req.proid = user.profile;
        req.priid = user.privacy;
        next();
    })

}

export function addUUID (req, res, next) {
    req.uuid = UUID.v4();
    next();
}
