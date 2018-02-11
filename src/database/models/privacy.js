import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
    displayname: {
        type: String,
    },
    visiblecontacts: {
        type: Array,
        default: ['email']
    },
    visibleitem: {
        type: Boolean,
        default: false  
    }
});

const Model = mongoose.model('privacy',schema);

export default Model;
