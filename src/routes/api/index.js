import express from 'express';
import axios from 'axios';
import _ from 'lodash';
import imrego from '../../database/models/imrego';
import Profile from '../../database/models/user-profile';
import Privacy from '../../database/models/privacy';
import User from '../../database/models/username';
import FoundItem from '../../database/models/found-item';
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
    imrego.find({uid: uid, activated: true}).then((itemLists, err)=>{
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
            data.set({activated: false, dateDeleted: Date.now()})
            data.save((err, imregoDeleted)=>{
                if (!err) {
                    res.send({success: true, msg:'Deleted'});
                } else res.send({success: false, msg: "Cannot delete. Contact Web Admin"})
            });
            // imrego.findByIdAndRemove(req.body.id)
            // .then((result)=>{
            //     res.send({success: true, msg:"Deleted"})
            // })
            // .catch((err)=>{
            //     res.send({success: false, msg:"Contact webmaster."})
            // })
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
        const {id, displayname, email, contact, address} = req.body;
        console.log (req.body);
        User.findById(uid, function (err, user){
            if (user.privacy==id){
                Privacy.findById(id, function (err, item){
                    item.set({displayname, email, contact, address, modifiedDate: Date.now()});
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

Router.post('/searchimrego', (req, res)=>{
    if (req.body.imNum!==undefined){
        const {uid} = req.session.unsignedToken;
        const {imNum} = req.body;
        imrego.findOne({imNum, activated:true}, (err, imrego) => {
            if (err){
                res.send({success: false, msg:"Can't search the database", errCode:'searchimrego-dbIssue'})
            } else {
                console.log (imrego)
                if (imrego!==null){
                if (imrego._doc.uid!=uid){
                    const {_doc} = imrego;
                    if (_doc.status==='Lost') {
                        User.findById(_doc.uid)
                        .populate('profile')
                        .populate('privacy')
                        .exec( function (err, user){
                            const {profile, privacy} = user;
                            if (!err){
                                const ownerData = {
                                    displayName: (privacy.displayname)? privacy.displayname : `${profile.fname} ${profile.lname}`,
                                    email: (privacy.email)? user.email : undefined,
                                    contact: (privacy.contact)? profile.contact : undefined,
                                    address: (privacy.address)? profile.address: undefined,
                                }
                                res.send({
                                    success:true, 
                                    imrego:{..._doc, uid:undefined},
                                    ownerData
                                });
                            } else res.send({success: false, msg:"Contact web administrator.", errCode:"searchimrego-userDataFetchingError"})
                        })
                    } else {
                        const {_id} = _doc
                        res.send({
                            success: true, 
                            imrego: {
                                _id:_doc._id, 
                                title: _doc.title, 
                                catagory: _doc.catagory,
                                // imgURL: _doc.imgURL,
                                imgURL: '',
                                description: 'undisclosed'
                            },
                            ownerData: {
                                displayName: 'undisclosed',
                            },
                        });
                    }
                } else res.send({success:false, msg: 'No record found'}) 
                } else res.send({success:false, msg: 'No record found'})
            }
        })
    } else res.send({success: false, msg: "Can't handle empty body!", errCode: "searchimrego-emptyBody" })
});

Router.post('/addfounditem', (req, res)=>{

    if (req.body._id){        
        const {uid} = req.session.unsignedToken
        const {_id} = req.body;

        FoundItem.findOne({uid, iid:_id})
        .exec(function (err, fi){
            if (fi!=null){
                const sl = fi.status.length-1;
                const deleted = (fi.status[sl]==='Deleted')
                if (deleted){
                    fi.set({status: [...fi.status, 'Holding']});
                    fi.set({date:[...fi.date, Date.now()]});
                    fi.save((err,founditem)=>{
                        if (!err){
                            res.send({success:true, data: founditem})
                        } else res.send ({success: false, msg: "Couldn't save. Please contact Web Administrator", errCode:'addfounditem-001'})
                    });
                } else res.send({success: false, msg:'Data already added', errCode:'addfounditem-000'})
            } else {
                new FoundItem({uid, iid:_id}).save((err, founditem)=>{

                    if (!err){
                        // console.log(founditem);
                        res.send({success:true, data: founditem})
                    } else res.send ({success: false, msg: "Couldn't save. Please contact Web Administrator", errCode:'addfounditem-001'})
                })
            }
        })
    } else res.send ({success:false, msg:'addfounditem-002'})
});

Router.post('/fetchfoundlist', (req, res)=>{
    const {uid} = req.session.unsignedToken
    FoundItem.find({uid})
    // FoundItem.find({uid, status: {$ne:'Deleted'}})
    .select('-uid')
    .populate({
        path: 'iid',
        match: {activated : true},
        populate: {
            path: 'uid',
            select: '-_id -password -creationDate',
            populate:{
                path: 'profile privacy'
            },
        }

    })
    .exec(function (err, fil){
        if (!err){
            if (fil!==null){
                const newFil = _.filter(fil, function (value){
                    const sl = value.status.length
                    return (value.status[sl-1]!=='Deleted')
                })
                const modifiedFil = _.map([...newFil], function(value){
                    const { iid } = value;
                    const {email, profile, privacy} = (iid!==null) ? iid.uid : {};
                    // const sl = value.status.length;
                    // if (value.status[sl-1]!=='Deleted'){
                        return({
                            key: value._id,
                            _id: value._id,
                            status: value.status,
                            date: value.date,
                            imrego: (iid!==null) ? {
                                imNum: iid.imNum,
                                title: iid.title,
                                catagory: iid.catagory,
                                description: (iid.status==='Lost') ? iid.description : undefined,
                                imgURL: (iid.status==='Lost') ? iid.imgURL : undefined,
                            } : null,
                            ownerData: (iid!==null) ? 
                                (iid.status==='Lost') ? {
                                    displayName: (privacy.displayname)? privacy.displayname : `${profile.fname} ${profile.lname}`,
                                    email: (privacy.email)? email : undefined,
                                    contact: (privacy.contact)? profile.contact : undefined,
                                    address: (privacy.address)? profile.address: undefined,
                                } : null
                            : null,
                        })
                    // } else return undefined
                })
                res.send({ success:true, data: modifiedFil});
            } else res.send({success:true, data: {}})
        } else res.send({success:false, msg:'Contact web administrator', errCode:'fetchfoundlist-000'});            
    });
});

Router.post('/updatefoundliststatus', (req, res)=>{
    if (req.body){
        const {uid} = req.session.unsignedToken;
        const {_id, status} = req.body;
        FoundItem.findOne({_id, uid}, (err, fil)=>{
            if (!err){
                if (fil!==null){
                    const updatedStatus = [...fil.status, status]
                    const updatedDate = [...fil.date, Date.now()];
                    fil.set({status: updatedStatus})
                    fil.set({date: updatedDate})
                    fil.save((err, deletedFil)=>{
                        if (!err){
                            res.send({success: true, msg: 'Found list deleted'})
                        } else res.send({success: false, msg: 'Contact web admin', errCode:'removefoundlist-002'})
                    })    
                } else res.send({success:true, msg:'No record found!'})
            } else res.send({success:false, msg:'Contact web administrator', errCode:'removefoundlist-001'});
        })
    } else res.send({success: false, msg: 'Cannot handle empty body', errCode:'removefoundlist-000'})
});

export default Router;
