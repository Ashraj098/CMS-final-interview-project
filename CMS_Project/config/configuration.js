module.exports = {
    connection_url : 'mongodb+srv://admin:TEweuNHsuXvRsMj8@cluster0.k7vky2a.mongodb.net/?retryWrites=true&w=majority',
    PORT : process.env.PORT || 9000,
    globalVariables: (req, res, next) => {
        res.locals.success_message = req.flash('success-message');
        res.locals.error_message = req.flash('error-message');
        res.locals.user = req.user || null;
        next();
    }
}