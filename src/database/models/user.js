import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
    username: {
        type: String,
        required: true
    },
    googleID: {
        type: String
    }
});

const Model = mongoose.model('user',schema);

const get = (callback, limit)=>{
    Model.find(callback).limit(limit);
}

export default Model;