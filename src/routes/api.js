import express from 'express';
import axios from 'axios';
import imrego from '../database/models/imrego';
import config from '../config';

const Router = express.Router();

Router.get('/', (req, res)=>{
    res.send({success: true, msg:`Welcome to server`});
});

Router.post('/imgupload', (req, res)=>{
    //If it contains the file Uploads the file to cloudinary and return the url
    //If no file then return default img URL from cloundinary 
    res.send({success: true, url: 'https://res.cloudinary.com/oleaw/image/upload/v1516746659/DP_z4ail6.jpg'})
});

Router.post('/imrego',(req, res)=>{
    if (req.body){
        const {uid} = req.session.unsignedToken;
        const {title, catagory, description, imgURL} = req.body;

        new imrego({uid, title, catagory, description, imgURL})
        .save((err, rego)=>{
            res.send({success: true, imNum: rego.imNum});
        });
    } else res.send({success: false, msg: 'Invalid request body'})
});

Router.post('/fetch-item-lists',(req, res)=>{
    const {uid} = req.session.unsignedToken;
// Note: send only activated onces.
// Note: don't send the uid value.
    imrego.find({uid: uid}).then((itemLists, err)=>{
        if (err) res.send({success: false, 
            msg:"Can't resolve the request. Please contact the webmasters."
        });   
        res.send({success: true, itemLists});
    })
});

export default Router;