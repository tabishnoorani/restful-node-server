import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../database/models/username';
import Session from '../database/models/session';
import config from '../config';
import {validSession} from './auth/middlewares';

const Router = express.Router();

Router.get ('/', (req,res) => {
    if (req.token) {
            res.send ({token: req.token, validToken: req.validToken, validSession: req.validSession, session: req.session});
    }
});

Router.get ('/initializeToken', validSession, (req, res)=>{
    User.findById(req.uid)
    .then((user, err)=>{
        if (err) res.status(403).send({
            success: false, 
            msg: "User login error. Please contact webmasters."
        });
        if (!user) {
            res.status(403).send({
            success: false, 
            msg: 'Authentication failed. User not found.'
        });
        } else {
            const {fname, lname, email} = user
            const data = {fname, lname, email}
            res.send({
                success: true, 
                msg: "User signed in.",  
                data: data});
        }
    });
});

Router.get('/signout', validSession, (req, res)=>{
    const {sid} = req.session.unsignedToken;
    Session.findById(sid).remove((err, data)=>{
        res.send ({success: true, msg:"Signout successfully."})
    });
});

Router.post('/signup', (req, res) => {
    const {fname, lname, email, password} = req.body.user;
    new User({fname, lname, email, password})
    .save((err, user) => {
        if (!err){
            new Session ({uid: user.id}).save((err, session)=>{
                const unsignedToken = {
                    sid: session.id, 
                    uid: session.uid
                };
                const token = jwt.sign({unsignedToken}, config.jwt.SECRET_KEY);
                const data = {fname, lname, email}
                res.send({success: true, msg:"User created.", token: token, data: data});
            })
        } else res.send({success:false, msg: "User couldn't be created."})
    });
});

Router.post('/signin', (req, res)=>{
    const {email, password} = req.body;
    
    User.findOne({email: email}).then((user, err)=>{
        if (err) res.status(403).send({
            success: false, msg: err
        });
        
        if (!user) {
            res.status(200).send({
            sucess: false, 
            msg: 'Authentication failed. User not found.'
        });}
        
        user.comparePassword(password, (err, isMatch)=>{
            if (isMatch && !err) {
                new Session ({uid: user.id}).save((err, session)=>{
                    const unsignedToken = {
                        sid: session.id, 
                        uid: session.uid
                    };
                    const token = jwt.sign({unsignedToken}, config.jwt.SECRET_KEY);
                    const {fname, lname, email} = user
                    const data = {fname, lname, email}
                    res.send({success: true, msg: "User signed in.", token: token, data: data});
                })} else res.status(200).send({
                    sucess: false,
                    msg: 'Authentication failed. Invalid Password.'
                });
            });
    });
});

export default Router;
