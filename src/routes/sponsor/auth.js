import express from 'express';
import jwt from 'jsonwebtoken';
import config from '../../config';
import Sponsor from '../../database/models/sponsor';
import Session from '../../database/models/s-session';
import { EWOULDBLOCK } from 'constants';
const Router = express.Router();

Router.post('/signup', (req, res)=>{
    const {sname, logo, email, password} = req.body;
    new Sponsor({sname, logo, email, password}).save()
    .then((user)=>{
        new Session ({uid: user.id}).save((err, session)=>{
            const unsignedToken = {
                sid: session.id, 
                uid: session.uid
            };
            const token = jwt.sign({unsignedToken}, config.jwt.SECRET_KEY);
            const data = {sname, logo, email}
            res.send({success: true, msg:"Sponsor created.", token: token, data: data});
        })
    })
    .catch((err)=>{
        res.send({success:false, msg: err})
    })
});

export default Router;