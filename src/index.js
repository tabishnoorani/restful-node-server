import config from './config'
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieSession from 'cookie-session';

import Server from './routes/server';
import Auth from './routes/auth';
import passport from 'passport';
import './routes/auth/passport-setup';
import './database';

const server = express();

server.set('view-engine','ejs');
server.use(cookieSession({
    maxAge: 24*60*60*1000, //msec
    keys: config.session.COOKIE_KEY
}));
server.use(express.static('public'));
server.use(bodyParser.urlencoded({extended:true}));
server.use(bodyParser.json());
server.use(passport.initialize());
server.use(passport.session());

server.use('/server',Server);
server.use('/auth', Auth);

server.get("/", (req, res)=>{
    res.render('index.ejs', {config: config.PORT, name: req.user.username})
});

server.listen(config.PORT, (err)=>{
    console.log (err?err:`Server is listening on port: ${config.PORT}`)
});
