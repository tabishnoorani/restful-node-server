import express from 'express';
import axios from 'axios';
import multer from 'multer';
import imrego from '../database/models/imrego';
import config from '../config';
import UUID from 'node-uuid';

const Router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, './public/upload/')
    },
    filename: (req, file, cb)=>{
        req.uuid = UUID.v4()
        const FILE = (req.uuid + '-' + file.originalname);
        cb(null, FILE);
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
        fileSize: 1024*1024*5 // 5 megabytes,
    },
    fileFilter: fileFilter
});

Router.get('/', (req, res)=>{
    res.send({success: true, msg:`Welcome to server`});
});

Router.post('/imgupload',upload.single('itemImg') , (req, res)=>{
    // res.send({success: true, url: 'https://res.cloudinary.com/oleaw/image/upload/v1516746659/DP_z4ail6.jpg'})   
    res.send(req.file);

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