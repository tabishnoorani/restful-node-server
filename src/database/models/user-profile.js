import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
    dob: Date,
    gender: String,
    contact: String,
    address: String,
    profilePicture: String,
    modifiedDate: Date
});

const Model = mongoose.model('userprofile',schema);

export default Model;
