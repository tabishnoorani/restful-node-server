import jwt from 'jsonwebtoken';
import config from '../../config';
import Session from '../../database/models/session';

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
    if (req.session!=""){
        const {uid, sid} = req.session.unsignedToken;
        Session.findById(sid, (err, data)=>{
            if (data && !err){
                if (data.uid == uid) {
                    req.validSession = true;
                    next();
                } else res.send({success: false, msg:"Not authorized"});
            }else res.send({success: false, msg:"Not authorized"});
        });
    } else res.send({success: false, msg:"Not authorized"});
}
