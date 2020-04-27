const express = require('express');
const router = express.Router();
const Books = require('../modal/books');

router.get('/', async (req, res) => {
    try {
        const allBooks = await Books.find({});
        res.render('index', { allBooks: allBooks });
    } catch{
        res.redirect('/');

    }
});

module.exports = router;