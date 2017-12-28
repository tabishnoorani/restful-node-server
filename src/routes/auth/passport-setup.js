import config from '../../config'
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import User from '../../database/models/user'



passport.serializeUser((user, done)=>{
    done(null, user.id);
}); //3

passport.deserializeUser((id, done)=>{
    User.findById(id)
    .then((user)=>{
        done(null, user);
    })
}); // attaches the value to req.

const callback = (accessToken, refrestToken, profile, done) => {
    console.log('passport callback function fired');
    User.findOne({googleID:profile.id}).then((user)=>{
        if (user) {
            done(null, user);
        } else {
            new User({
                username: profile.displayName,
                googleID: profile.id,
            })
            .save()
            .then((newUser)=>{
                done(null, newUser);                
            })
        }
    });
} //2

const gs = new GoogleStrategy({
    clientID: config.google.CLIENT_ID,
    clientSecret: config.google.CLIENT_SECRET,
    callbackURL: config.google.CALLBACK_URL 
}, callback);

passport.use(gs); //1 //2
