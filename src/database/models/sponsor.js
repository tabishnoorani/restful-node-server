import mongoose from 'mongoose';
import UserProfile from './sponsor-profile';
import bcrypt from 'bcrypt';
const Schema = mongoose.Schema;

const schema = new Schema({
    sname: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
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
    profileID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: UserProfile,
        required: false
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
});


// schema.pre('validate', (next)=>{
//     next();
// });

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

const Model = mongoose.model('sponsor',schema);

const get = (callback, limit)=>{
    Model.find(callback).limit(limit);
}

export default Model;
