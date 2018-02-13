import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
    displayname: {
        type: String,
    },
    visiblecontacts: {
        type: Array,
        default: ['Email']
    },
    visibleitem: {
        type: Boolean,
        default: false  
    },
    modifiedDate: {
        type: Date,
        default: Date.now()
    }
});

const Model = mongoose.model('privacy',schema);

export default Model;
