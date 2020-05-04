module.exports.checkAuthenticated = (req, res, next) => {
    console.log('ind');
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/authentication');
};
module.exports.checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}