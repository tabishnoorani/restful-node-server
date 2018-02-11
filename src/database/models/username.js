import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const Schema = mongoose.Schema;

const schema = new Schema({
    fname: {
        type: String,
        // required: true
    },
    lname: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    profile:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userprofile',
    },
    privacy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'privacy',
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
});

schema.pre('save', function(next){
    const user = this;
    if (this.isModified('password') || this.isNew){
        bcrypt.genSalt(10, (err ,salt)=>{
            if (err) next(err);
            bcrypt.hash(user.password, salt, (err, hash)=>{
                if (err) next(err);
                user.password = hash;
                next();
            });
        })
    } else next();
});


schema.methods.comparePassword = function (pw, cb){
    bcrypt.compare(pw, this.password, (err, isMatch)=>{
        cb(err, isMatch);
    });
}

const Model = mongoose.model('username',schema);

const get = (callback, limit)=>{
    Model.find(callback).limit(limit);
}

export default Model;
