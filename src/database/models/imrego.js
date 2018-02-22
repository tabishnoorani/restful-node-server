import mongoose from 'mongoose';
import User from './username';
import Sponsor from './sponsor';
// import uuid from 'node-uuid';

const Schema = mongoose.Schema;

const schema = new Schema({
    imNum: {
        type: String,
        // default: uuid.v4(),
        required: true
    },
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'username',
        required: true
    },
    title:{
        type: String,
        required: true,
    },
    catagory:{
        type: String,
        required: true,
    },
    description: String,
    imgURL: {
        type: String
    },
    status:{
        type: String,
        required: true,
        default: "Normal"
    },
    date:{
        type: Date,
        default: Date.now,
        required: true 
    },
    sponsoredBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: Sponsor,
        default: "5a69add2d19d8c15300edd55"
    },
    activated:{
        type: Boolean,
        default: true,
    },
    dateLost: [Date],
    dateFound:[Date],
    dateDeleted:Date
});

const Model = mongoose.model('imrego', schema);

export default Model;
