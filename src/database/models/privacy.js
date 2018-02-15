import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
    displayname: {
        type: String,
    },
    // visiblecontacts: {
    //     type: Array,
    //     default: ['Email']
    // },
    email: {
        type: Boolean,
        default: true  
    },
    contact: {
        type: Boolean,
        default: false  
    },
    address: {
        type: Boolean,
        default: false  
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
