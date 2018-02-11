import config from '../config';
import mongoose from 'mongoose';

mongoose.connect(config.database.mlab.URL, {useMongoClient: true},  (err)=>{
    console.log (err?err:"Connected")
});