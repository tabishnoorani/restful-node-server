import express from 'express';
import axios from 'axios';
import multer from 'multer';
import cloudinary from 'cloudinary';
import cloudinaryStorage from 'multer-storage-cloudinary';
import UUID from 'node-uuid';
import imrego from '../database/models/imrego';
import config from '../config';

const Router = express.Router();

cloudinary.config({...config.Cloudinary})

const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'folder-name',
    allowedFormats: ['jpg', 'png'],
    filename: function (req, file, cb) {
      cb(undefined, 'my-file-name');
    }
  });

const fileFilter =  (req, file, cb)=>{
    if (file.mimetype==='image/jpeg' || file.mimetype==='image/png'){
        cb(null, true)
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024*1024*3 // 3 megabytes,
    },
    fileFilter: fileFilter
});

Router.get('/', (req, res)=>{
    res.send({success: true, msg:`Welcome to server`});
});

Router.post('/imgupload',upload.single('file') , (req, res)=>{
    // res.send({success: true, url: 'https://res.cloudinary.com/oleaw/image/upload/v1516746659/DP_z4ail6.jpg'})   
    console.log(req.file);
    res.send("req.fileList");
});

Router.post('/imrego', upload.single('itemImg'), (req, res)=>{
    if (req.body){
        const {uid} = req.session.unsignedToken;
        const {title, catagory, description, imgURL} = req.body;

        new imrego({uid, title, catagory, description, imgURL})
        .save((err, rego)=>{
            res.send({success: true, imrego: {...rego, _doc:{...rego._doc, uid:""}}});
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

Router.post('/delete-item-list', (req, res)=>{
    const {uid} = req.session.unsignedToken;
    
    imrego.findById(req.body.id)
    .then((data)=>{
        if (data.uid==uid){
            imrego.findByIdAndRemove(req.body.id)
            .then((result)=>{
                res.send({success: true, msg:"Deleted"})
            })
            .catch((err)=>{
                res.send({success: false, msg:"Contact webmaster."})
            })
        } else {res.send({success: false, msg: "Not a valid request."})}
    })
    .catch((err)=>{
        res.send({success: false, msg:"Contact webmaster."})
    });
})

export default Router;