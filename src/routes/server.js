//This route is responsible for API requests only.
import express from 'express';
const Router = express.Router();
// Router.use();

Router.get('/', (req, res)=>{
    res.send('Welcome to server');
});

export default Router;