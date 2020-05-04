if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

//passport login
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');

const passportIntialise = require('./passportConfig');
passportIntialise(passport);

const users = [];

app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(expressLayouts);
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ limit: '10mb', urlencoded: false, extended: false }));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')
app.set('layout', __dirname + '/views/layout')
app.set('public', __dirname + '/public')
app.use(express.static(__dirname + '/public'));


const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection;
db.on('error', (error) => { console.log(error) })
db.once('open', () => { console.log('mongo running....') });



const indexRouters = require('./routers/routers.js');
const authentication = require('./routers/authentication.js');
const authorRouters = require('./routers/authors');
const bookRouters = require('./routers/books');
app.use('/', indexRouters);
app.use('/authentication', authentication);
app.use('/authors', authorRouters);
app.use('/books', bookRouters);
app.use('*', (req, res) => {
    res.send('Please provide the valid url');
});

app.listen(process.env.PORT || 3001);