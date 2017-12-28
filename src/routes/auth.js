//This router is responsible for Auth requests only.
import express from 'express';
import passport from 'passport';

const Router = express.Router();

Router.get('/google', passport.authenticate('google',{
    scope: ['profile']
}));

Router.get('/google/redirect',passport.authenticate('google'), (req, res)=> {
    res.redirect('/');
});

Router.get('/logout', (req, res)=>{
    req.logout();
    res.send('Logout');
})

export default Router;
