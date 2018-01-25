import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
    dob: Date,
    gender: String,
    contact:{
        mobile: Number,
        home: Number,
        office: Number,
        primary: Number
    },
    address: String,
    modifiedDate: Date
});

const Model = mongoose.model('sponsorprofile',schema);

export default Model;
