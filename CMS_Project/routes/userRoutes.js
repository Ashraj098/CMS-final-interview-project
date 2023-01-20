const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const passport = require('passport');    
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');  
const User = require('../models/UserModel').User;

router.all('/*', (req, res, next) => {

    req.app.locals.layout = 'user';

    next();
});


// Default user routes
router.route('/')
    .get(userController.index);


// Defining Local Strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({email: email}).then(user => {
        if (!user) {
            return done(null, false, req.flash('error-message', 'User not found with this email.'));
        }

        bcrypt.compare(password, user.password, (err, passwordMatched) => {
            if (err) {
                return err;
            }

            if (!passwordMatched) {
                return done(null, false, req.flash('error-message', 'Invalid Username or Password'));
            }

            return done(null, user, req.flash('success-message', 'Login Successful'));
        });

    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});


// login endpoint
router.route('/login')
    .get(userController.loginGet)
    .post(passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/login',
        failureFlash: true,
        successFlash: true,
        session: true
    }) ,userController.loginPost);


// registeration endpoint
router.route('/register')
    .get(userController.registerGet)
    .post(userController.registerPost);

// single post endpoint
router.route('/post/:id')
    .get(userController.getSinglePost)

//logout endpoint
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success-message', 'Logout was successful');
    res.redirect('/');
});

module.exports = router;
