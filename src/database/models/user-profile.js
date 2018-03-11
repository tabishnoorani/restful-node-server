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
    prefix: String,
    contact: String,
    address: String,
    profilePicture: String,
    modifiedDate: {
        type: Date,
        default: Date.now()
    },
    notification: {
        type: Array,
        default: [],
    },
    lastseen: {
        type: String,
        default: null
    }
});

const Model = mongoose.model('userprofile',schema);

export default Model;
