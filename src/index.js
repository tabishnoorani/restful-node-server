import config from './config'
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import {getTokenValue, validSession} from './routes/auth/middlewares';

import Api from './routes/api';
import Auth from './routes/auth';
import './database';

const server = express();

server.set('view-engine','ejs');
server.use(morgan('dev'));
server.use(express.static('public'));
server.use(bodyParser.urlencoded({extended:true}));
server.use(bodyParser.json());
server.use(cors());
// Check for the token and its validity- Sets req.token(t/f), req.validToken(t/f) and req.session(with data).
server.use(getTokenValue);

server.use('/api', validSession, Api);
server.use('/auth', Auth);

server.get("/", (req, res)=>{
    res.render('index.ejs', {config: config.PORT, name: "Tabbish"})
});

server.listen(config.PORT, (err)=>{
    console.log (err?err:`Server is listening on port: ${config.PORT}`)
});
