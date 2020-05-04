const express = require('express');
const router = express.Router();
const userSchema = require('../modal/userDetails');
const auth = require('../middlewares/auth');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { check, validationResult } = require("express-validator/check");


router.get('/', auth.checkNotAuthenticated, (req, res) => {
    console.log('loginlll');
    res.render('authentication/login', { layout: 'layout/beforeLogin.ejs', template: 'login' });
});
router.get('/registration', auth.checkNotAuthenticated, (req, res) => {
    res.render('authentication/registration', { layout: 'layout/beforeLogin.ejs', template: 'register' });
});


//Registartion form submit
router.post('/', auth.checkNotAuthenticated, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    let email
    if (emaptyValidate(req.body.email)) {
        email = req.body.email;
    }
    try {
        const users = await userSchema.find({ emailId: email });
        if (users.length == 0) {
            const salt = await bcrypt.genSalt(10);
            const hashpassword = await bcrypt.hash(req.body.psw, salt);
            const user = new userSchema({
                name: req.body.name,
                emailId: req.body.email,
                userType: 'user',
                password: hashpassword
            });
            await user.save();
        }
        res.render('authentication/login', { layout: 'layout/beforeLogin.ejs', template: 'login' });
    } catch (e) {
        console.log(e);
        res.status(500).redirect('/');
    }

});


//login router
router.post(
    "/login",
    auth.checkNotAuthenticated,
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/authentication',
        failureFlash: true
    })
);

router.delete('/logout', auth.checkAuthenticated, (req, res) => {
    req.logout();
    res.redirect('/authentication');
});
function emaptyValidate(param) {
    if (param !== null && param !== '') {
        return true;
    }
    return true;

}
module.exports = router;