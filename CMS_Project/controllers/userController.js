const Post = require('../models/PostModel').Post;
const bcrypt = require('bcryptjs');            
const User = require('../models/UserModel').User;

module.exports = {

    index: async (req, res) => {

        const posts = await Post.find();
        res.render('user/index', { posts: posts});    
    },

    /* LOGIN ROUTES */
    loginGet: (req, res) => {
        res.render('user/login', { message: req.flash('error') });
    },


    loginPost: (req, res) => {

    },

    /* REGISTER ROUTES*/

    registerGet: (req, res) => {
        res.render('user/register');
    },

    registerPost: (req, res) => {
        let errors = [];

        if (!req.body.firstName) {
            errors.push({ message: 'First name is mandatory' });
        }
        if (!req.body.lastName) {
            errors.push({ message: 'Last name is mandatory' });
        }
        if (!req.body.email) {
            errors.push({ message: 'Email field is mandatory' });
        }
        if (!req.body.password || !req.body.passwordConfirm) {
            errors.push({ message: 'Password field is mandatory' });
        }
        if (req.body.password !== req.body.passwordConfirm) {
            errors.push({ message: 'Passwords do not match' });
        }

        if (errors.length > 0) {
            res.render('user/register', {
                errors: errors,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email
            });
        } else {
            User.findOne({ email: req.body.email }).then(user => {
                if (user) {
                    req.flash('error-message', 'Email already exists, try to login.');
                    res.redirect('/login');
                } else {
                    const newUser = new User(req.body);

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            newUser.password = hash;
                            newUser.save().then(user => {
                                req.flash('success-message', 'You are now registered');
                                res.redirect('/login');
                            });
                        });
                    });
                }
            });
        }
    },

    getSinglePost: (req, res) => {
        const id = req.params.id;

        Post.findById(id)
            .then(post => {
                if (!post) {
                    res.status(404).json({ message: 'No Post Found' });
                }
                else {
                    res.render('user/singlePost', { post: post });
                }
            })
    },

};

