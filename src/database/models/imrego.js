import mongoose from 'mongoose';
import User from './username';
import uuid from 'node-uuid';

const Schema = mongoose.Schema;

const schema = new Schema({
    imrego: {
        type: String,
        default: uuid.v4(),
        required: true
    },
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    imgurl: {
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
    description: String,
    dateLost: [Date],
    dateFound:[Date]
});

const Model = mongoose.model('imrego',schema);

export default Model;
