import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'username',
        required: true
    },
    iid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'imrego',
        required: true
    },
    status:{
        type: [String],
        required: true,
        default: ["Holding"] // Settled (Give to the owner), Disposed (Can't hold further), Lost(Lost it again, Transfered(Transfered to someone else having account)
    },
    date:{
        type: [Date],
        required: true,
        default: [Date.now()]
    }
});

const Model = mongoose.model('founditem', schema);

export default Model;
