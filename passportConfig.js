const localStartegy = require('passport-local').Strategy;
const userSchema = require('./modal/userDetails');
const bcrypt = require('bcrypt');

function passportIntialise(passport) {
    const authenticateUser = async (email, psw, done) => {
        userSchema.find({ emailId: email }, (err, user) => {
            if (err) throw err;
            if (user.length == 0) {
                return done(null, false, { message: 'No user with that email' })
            }
            try {
                bcrypt.compare(psw, user[0].password, function (err, isMatch) {
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                        // res.redirect('/');
                    } else {
                        return done(null, false, { message: 'Invalid Password' });
                    }
                });
            } catch (e) {
                return done(e)
            }

        });
    }
    passport.use(new localStartegy({ usernameField: 'email', passwordField: 'psw' }, authenticateUser));
    passport.serializeUser((user, done) => done(null, user[0].id))
    passport.deserializeUser((id, done) => {
        userSchema.findById(id, function (err, user) {
            return done(err, user);
        });
    })
}

module.exports = passportIntialise;