import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
    uid: {
        type: String,
        required: true
      },
    date:{
        type: Date,
        default: Date.now,
        required: true 
    },
    logoutDate: {
        type: Date,
    }
});

const Model = mongoose.model('s-session',schema);

export default Model;