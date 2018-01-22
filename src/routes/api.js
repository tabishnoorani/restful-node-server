import express from 'express';
import cloudinary from 'cloudinary';
import multer from 'multer';
import imrego from '../database/models/imrego';
import config from '../config';

const Router = express.Router();

cloudinary.config({...config.Cloudinary});

// const upload = multer({ dest: 'uploads/' });

Router.get('/', (req, res)=>{
    res.send({success: true, msg:`Welcome to server`});
});

Router.post('/imgupload', (req, res)=>{
    cloudinary.v2.uploader.upload(req.file, function(result) { 
        res.send({success: true, imgURL: result}) 
    }); 
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