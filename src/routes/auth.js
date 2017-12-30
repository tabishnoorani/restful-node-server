//This router is responsible for Auth requests only.
import express from 'express';
import User from '../database/models/username';

const Router = express.Router();

Router.post('/signup', (req, res) => {
    const {fname, lname, email, password} = req.body.user;
    new User({fname, lname, email, password}).save((err, doc) => 
    {
        if (err) return res.send(`Error is: ${err}`);
        res.send(`Data is: ${doc}`);
    });
});

Router.post('/signin', (req, res)=>{
    const {email, password} = req.body.user;
    
    User.findOne({email: email}).then((user, err)=>{
        if (err) res.send(err);
        if (!user) res.status(403).send({sucess: false, msg: 'Authentication failed. User not found.'});
        
        user.comparePassword(password, (err, isMatch)=>{
            if (isMatch && !err) {
                res.send(user.id);
            } else {
                res.status(403).send({sucess: false, msg: 'Authentication failed. Invalid Password.'});
            }
        });

    });
});

export default Router;
