import express from 'express';
import axios from 'axios';
import imrego from '../../database/models/imrego';
import Upload from './Multer';
import { addUUID } from '../auth/middlewares';
import config from '../../config';

const Router = express.Router();

//Testing Route
Router.get('/', (req, res)=>{
    res.send({success: true, msg:`Welcome to server`});
});

//Testing Route
Router.post('/imgupload', Upload.single('file') , (req, res)=>{
    console.log(req.file);
    res.send({success: true, url:req.file.secure_url});
});


Router.post('/imrego', addUUID, Upload.single('file'), (req, res)=>{
    if (req.body){
        const {uid} = req.session.unsignedToken;
        const {title, catagory, description} = req.body;
        const {uuid} = req

        new imrego({uid,
            imNum: uuid,
            title,
            catagory,
            description,
            imgURL:(req.file)?
                req.file.secure_url:
                config.DEFAULT_ITEMLIST_IMG
            })
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