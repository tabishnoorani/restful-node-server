import express from 'express';
import Auth from './auth';

const Router = express.Router();

Router.use('/auth', Auth);

Router.get('/', (req, res)=>{
    res.send({success: true, msg:'You are the sponsors page.'});
});

export default Router;