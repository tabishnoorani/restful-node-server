import config from '../config';
import mongoose from 'mongoose';

const url = "mongodb://localhost:27017/imrego";

mongoose.connect(config.database.mlab.URL, {useMongoClient: true},  (err)=>{
    console.log (err?err:"Connected")
});