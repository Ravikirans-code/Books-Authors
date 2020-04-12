const express = require('express');
const Router = express.Router();
const Authors = require('../modal/authors');

//All Authors Route
Router.get('/', async (req, res) => {
    let searchOptions = {};
    if(req.query.txtSearchAuthor != null && req.query.txtSearchAuthor !== ''){
        searchOptions.name = new RegExp(req.query.txtSearchAuthor, 'i');
    }
    try {
        const authors = await Authors.find(searchOptions);
        res.render('authors/index', { 
            authors: authors,
            searchOptions: req.query
        
        });
    } catch (e) {
        res.render('authors/index', {
            author: author,
            errorMessage: e
        });
    }
});


//Create new route
Router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Authors() });
});

//Add author into mongo
Router.post('/', async (req, res) => {
    const author = new Authors({
        name: req.body.txtAuthorName
    })
    try {
        await author.save()
        res.redirect('authors');
    } catch (e) {
        res.render('authors/new', {
            author: author,
            errorMessage: e
        });

    }
});

module.exports = Router;