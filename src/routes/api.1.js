import express from 'express';
import cloudinaryStorage from 'multer-storage-cloudinary';
import cloudinary from 'cloudinary';
import multer from 'multer';
import imrego from '../database/models/imrego';
import config from '../config';

const Router = express.Router();

cloudinary.config(config.Cloudinary);

const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: './images',
    allowedFormats: ['jpg', 'png'],
    filename: function (req, file, cb) {
        cb(null, `${new Date()}-${file.originalname}`)
    }
});

const parser = multer({ storage: storage });


Router.get('/', (req, res)=>{
    res.send({success: true, msg:`Welcome to server`});
});

Router.post('/imgupload', parser.array('images', 10), (req, res)=>{
    res.send({success: true});

    // cloudinary.uploader.upload(file, function(result) { 
    //     res.send({success: true, imgURL: result}) 
    // });  
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