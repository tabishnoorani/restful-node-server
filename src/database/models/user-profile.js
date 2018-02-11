import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    dob: Date,
    gender: {
        type: String,
        default: 'u'
    },
    contact: String,
    address: String,
    profilePicture: String,
    modifiedDate: {
        type: Date,
        default: Date.now()}
});

const Model = mongoose.model('userprofile',schema);

export default Model;
