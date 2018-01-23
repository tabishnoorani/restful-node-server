import express from 'express';
import cloudinary from 'cloudinary';
import multer from 'multer';
import imrego from '../database/models/imrego';
import config from '../config';
import path from 'path';
const Router = express.Router();

cloudinary.config({...config.Cloudinary});

const storage = multer.diskStorage({
    // destination: '../../../public/images',
    filename: function(req, file, cb){
        cb(null, file.fieldname+'-'+Date.now()+path.extname(file.originalname));
    }
});

const upload = multer ({storage: storage,
                        limits:{fileSize: 2000000},
                        // fileFilter: checkFileType(file ,cb)
                    }).single('file');

// function checkFileType(req, file, cb){
//     const fileType = /jpeg|jpg|png|gif/;
//     const extname = fileType.test(path.extname(file.originalname).toLowerCase());
//     const mimeType = fileType.test(file.mimetype);
//     if (mimeType && extname){
//         return cb(null, true)
//     } else {
//         return cb('Error: Images only');
//     }
// }

Router.post('/imgupload', (req, res)=>{
    upload(req, res, (err)=>{
        if(err){
            res.send(err);
        }else {
            if (req.file === undefined){
                res.send ('Error: No file selected');
            } else {
                res.send({msg: 'Success: File uploaded.',
                file: req.file.filename
                })
            }
            console.log(req.file);
            res.send("test");
        }
    })
    // cloudinary.v2.uploader.upload(req.file, {upload_preset: } function(result) { 
    //     res.send({success: true, imgURL: result}) 
    // }); 
});

Router.get('/', (req, res)=>{
    res.send({success: true, msg:`Welcome to server`});
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