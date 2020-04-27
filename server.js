if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');

app.use(expressLayouts);
app.use(bodyParser.urlencoded({ limit: '10mb', urlencoded: false }));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')
app.set('layout', __dirname + '/views/layout')
app.set('public', __dirname + '/public')
app.use(express.static(__dirname+'/public'));


const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection;
db.on('error', (error) => { console.log(error) })
db.once('open', () => { console.log('mongo running....') })

const indexRouters = require('./routers/routers.js');
const authorRouters = require('./routers/authors');
const bookRouters = require('./routers/books');
app.use('/', indexRouters);
app.use('/authors', authorRouters);
app.use('/books', bookRouters);
app.use('*', (req, res) => {
    res.send('Please provide the valid url');
});

app.listen(process.env.PORT || 3000);