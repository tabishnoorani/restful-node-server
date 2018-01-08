//This route is responsible for API requests only.
import express from 'express';
import uuid from 'node-uuid';
import imrego from '../database/models/imrego';

const Router = express.Router();

// Router.use();

Router.get('/', (req, res)=>{
    res.send(`Welcome to server${uuid.v4()}`);
});

Router.post('/imrego',(req, res)=>{
    if (req.body){
        const {uid} = req.session.unsignedToken
        const {description, img} = req.body;
        new imrego({description, uid}).save((err, rego)=>{
            res.send({imrego: rego.imrego});
        });
        
    } else res.send({success: false, msg: 'Invalid request body'})
});

export default Router;