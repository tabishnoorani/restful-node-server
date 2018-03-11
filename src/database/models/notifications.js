import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'username',
        required: true
    },
    nCode: {
        type: String, // founditem
        required: true
    },
    refdb:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'founditem',
    },
    data: {
        type: Object,
        required: true
    },
    ack:{
        type: String,
    },
    ackDate:{
        type: Date,
    },
    date:{
        type: Date,
        required: true,
        default: Date.now()
    }
});

const Model = mongoose.model('notification', schema);

export default Model;
