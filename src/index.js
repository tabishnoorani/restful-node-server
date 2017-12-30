import config from './config'
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieSession from 'cookie-session';
import morgan from 'morgan';

import Api from './routes/api';
import Auth from './routes/auth';
import './database';

const server = express();

server.set('view-engine','ejs');
server.use(morgan('dev'));
// server.use(cookieSession({
//     maxAge: 24*60*60*1000, //msec
//     keys: config.session.COOKIE_KEY
// }));
server.use(express.static('public'));
server.use(bodyParser.urlencoded({extended:true}));
server.use(bodyParser.json());

server.use('/api',Api);
server.use('/auth', Auth);

server.get("/", (req, res)=>{
    res.render('index.ejs', {config: config.PORT, name: "Tabbish"})
});

server.listen(config.PORT, (err)=>{
    console.log (err?err:`Server is listening on port: ${config.PORT}`)
});
