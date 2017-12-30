import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
    sessionID: {
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

// schema.pre('validate', (next)=>{
//     next();
// });

// schema.pre('save', function(next){
//     next();
// });

// schema.methods.comparePassword = function (pw, cb){
//     bcrypt.compare(pw, this.password, (err, isMatch)=>{
//         cb(err, isMatch);
//     });
// }

const Model = mongoose.model('session',schema);

export default Model;