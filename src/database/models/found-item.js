import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
    uid: {
        type: mongoose.Schema.Types.ObjectId,
    },
    imNum: {
        type: String,
        // default: uuid.v4(),
        required: true
    },
    status:{
        type: String,
        required: true,
        default: "Holding" // Settled (Give to the owner), Disposed (Can't hold further), Lost(Lost it again, Transfered(Transfered to someone else having account)
    },
});

const Model = mongoose.model('founditem', schema);

export default Model;
