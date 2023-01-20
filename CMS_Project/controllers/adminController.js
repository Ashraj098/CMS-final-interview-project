const Post = require('../models/PostModel').Post;

module.exports = {

    index: (req, res) => {
        res.render('admin/index');

    },

    /* ADMIN POSTS ENDPOINTS */
    getPosts: (req, res) => {
        Post.find()
            .then(posts => {
                res.render('admin/posts/index', {posts: posts});
            });
    },

    getCreatePostPage: (req, res) => {
        res.render('admin/posts/create');
    },

    submitCreatePostPage: (req, res) => {
        // Check for any input file
        let filename = '';
        
        if (req.files) {
            let file = req.files.uploadedFile;
            filename = file.name;
            let uploadDir = './public/uploads/';

            file.mv(uploadDir+filename, (err) => {
                if (err)
                    throw err;
            });
        }

        const newPost = new Post({
            title: req.body.title,
            description: req.body.description,
            file: `/uploads/${filename}`
        });

        newPost.save().then(post => {
            req.flash('success-message', 'Post created successfully.');
            res.redirect('/admin/posts');
        });
    },

    getEditPostPage: (req, res) => {
        const id = req.params.id;

        Post.findById(id)
            .then(post => {
                res.render('admin/posts/edit', {post: post})
            });
    },

    submitEditPostPage: (req, res) => {
        const id = req.params.id;
        
        Post.findById(id)
            .then(post => {
                post.title = req.body.title;
                post.description = req.body.description;
                post.file = `/uploads/${filename}`   

                post.save().then(updatePost => {
                    req.flash('success-message', `The Post ${updatePost.title} has been updated.`);
                    res.redirect('/admin/posts');
                });
            });
    },

    deletePost: (req, res) => {
        Post.findByIdAndDelete(req.params.id)
            .then(deletedPost => {
                req.flash('success-message', `The post ${deletedPost.title} has been deleted.`);
                res.redirect('/admin/posts');
            });
    }

};

