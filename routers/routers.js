const express = require('express');
const router = express.Router();
const Books = require('../modal/books');
const auth = require('../middlewares/auth');

router.get('/',auth.checkAuthenticated, async (req, res) => {
    try {
        const allBooks = await Books.find({});
        res.render('index', { allBooks: allBooks });
    } catch{
        res.redirect('/');

    }
});

module.exports = router;