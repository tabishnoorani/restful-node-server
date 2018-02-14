import express from 'express';
import axios from 'axios';
import imrego from '../../database/models/imrego';
import Profile from '../../database/models/user-profile';
import Privacy from '../../database/models/privacy';
import User from '../../database/models/username';
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
    res.send({success: true, url:req.file.secure_url});
});


Router.post('/imrego', addUUID, Upload.single('file'), (req, res)=>{
    if (req.body){
        const {uid} = req.session.unsignedToken;
        const {title, catagory, description} = req.body;
        const {uuid} = req

        new imrego({
            uid,
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

Router.post('/updateimrego', Upload.single('file'), (req, res)=>{
    if (req.body){
        const {uid} = req.session.unsignedToken;
        const {id, title, catagory, description} = req.body;
        // const {uuid} = req

        imrego.findById(id, function (err, item){
            if (!err && item.uid !== uid){
                if (req.file){
                    item.set({imgURL: req.file.secure_url});
                }
                item.set({title, catagory, description});
                item.save((err, updatedRego)=>{
                    if (!err) {
                        res.send({success: true, imrego:{...updatedRego._doc, uid:""}})
                    } else res.send({success: false, msg: 'Can not update!'})
                });
            } else res.send({success: false, msg:"You are not authorized to update this content!"});
        }) 
    } else res.send({success: false, msg:"Can't handle empty body!"});
});

Router.post('/updateimregostatus', (req, res)=>{
    if (req.body){
        const {uid} = req.session.unsignedToken;
        const {id, status} = req.body;
        
        imrego.findById(id, function (err, item){
            if (!err && item.uid !== uid){
                item.set({status});
                item.save((err, updatedRego)=>{
                    if (!err) {
                        res.send({success: true, imrego:{...updatedRego._doc, uid:""}})
                    } else res.send({success: false, msg: 'Can not update the status!'})
                });
            } else res.send({success: false, msg:"You are not authorized to update this content!"});
        }) 
    } else res.send({success: false, msg:"Invalid request to the server!"});
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

Router.post('/updateprofile', Upload.single('file'), (req, res)=>{
    if (req.body){
        const {uid} = req.session.unsignedToken;
        const {id, gender, dob, address, prefix, contact} = req.body;
        // const {uuid} = req
        User.findById(uid, function (err, user){
            if (user.profile==id){
                Profile.findById(id, function (err, item){
                    if (req.file){
                        item.set({profilePicture: req.file.secure_url});
                    }
                    item.set({gender, dob, address, prefix, contact, modifiedDate: Date.now()});
                    item.save((err, profile)=>{
                        if (!err) {
                            res.send({success: true, profile});
                        } else res.send({success: false, msg: 'Can not update!'})
                    });
                });
            } else res.send({success: false, msg:"You are not authorized to update this content!"});
        });
    } else res.send({success: false, msg:"Can't handle empty body!"});
});

Router.post('/removeimg', (req, res)=>{
    if (req.body){
        const {uid} = req.session.unsignedToken;
        const {id} = req.body;

        User.findById(uid, function (err, user){
            const userProfile = user.profile;
            if (userProfile == id) {
                Profile.findById(id, function (err, item){
                    item.set({profilePicture: ""});
                    item.save((err, profile)=>{
                        if (!err) {
                            res.send({success: true, profile});
                        } else res.send({success: false, msg: 'Cannot update!'})
                    });
                }); 
            } else res.send({success: false, msg:"You are not authorized to update this content!"});
        });
    } else res.send({success: false, msg:"Can't handle empty body!"});
});

Router.post('/updateprivacy', (req, res)=>{
    if (req.body){
        const {uid} = req.session.unsignedToken;
        const {id, displayname, visiblecontacts} = req.body;
        console.log (req.body);
        // const {uuid} = req
        User.findById(uid, function (err, user){
            if (user.privacy==id){
                Privacy.findById(id, function (err, item){
                    item.set({displayname, visiblecontacts, modifiedDate: Date.now()});
                    item.save((err, profile)=>{
                        if (!err) {
                            res.send({success: true, profile});
                        } else res.send({success: false, msg: 'Can not update!'})
                    });
                });
            } else res.send({success: false, msg:"You are not authorized to update this content!"});
        });
    } else res.send({success: false, msg:"Can't handle empty body!"});
});

Router.post('/changepassword', (req, res)=> {
    if (req.body){
        const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g;
        const newPasswordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g;
        const {uid} = req.session.unsignedToken;
        const {password, newPassword} = req.body;
        if (passwordPattern.test(password)===true && newPasswordPattern.test(newPassword)===true){
            User.findById(uid, (err,user)=>{
                user.comparePassword(password, (err, isMatch)=>{
                    if (!err && isMatch) {
                        user.set({password: newPassword})
                        user.save((err,user)=>{
                            if (!err){
                                res.send({success:true, msg: "Password changed."})
                            } else res.send({success:false, msg: "Database couldn't be updated.", errCode:"dbErr"})
                        })
                    } else res.send({success:false, msg: "The password entered is not correct. Please retype the password.", errCode:"incPwd"})
                });
            })
        } else res.send({success: false, msg: "The passwords are not at desired security standards", errCode:'unStdPwd'})
    } else res.send({success: false, msg:"Can't handle empty body!"});
});

export default Router;
