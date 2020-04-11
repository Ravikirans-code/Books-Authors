if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}
console.log(__dirname+'/.env');
console.log(process.env.DATABASE_URI);
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const indexRouters = require('./routers/routers.js');
const mongoose = require('mongoose');

app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', __dirname+'/views')
app.set('layout', __dirname+'/views/layout')
app.set('public', __dirname+'/public')

mongoose.connect(process.env.DATABASE_URI, {useNewUrlParser:true, useUnifiedTopology: true })
const db = mongoose.connection;
db.on('error', (error) => {console.log(error)})
db.once('open', () => {console.log('mongo running....')})

app.use(indexRouters);
app.listen(process.env.PORT || 3000);