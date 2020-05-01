const express = require('express');
const Router = express.Router();
const Authors = require('../modal/authors');
const Books = require('../modal/books');

//All Authors Route
Router.get('/', async (req, res) => {
    let searchOptions = {};
    if (req.query.txtSearchAuthor != null && req.query.txtSearchAuthor !== '') {
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

Router.get('/:id', async (req, res) => {
    try{
        const author  = await Authors.findById(req.params.id);
        const books  = await Books.find({author: req.params.id}).limit(6).exec();
        res.render('authors/view',{
            authors:author,
            booksByAuthors: books
        })
    }catch{
        res.redirect('/');
    }
});
Router.get('/:id/edit', async (req, res) => {
    console.log(req.params.id);
    try {
        const authors = await Authors.findById(req.params.id);
        res.render('authors/authorEdit', { authors: authors });
    } catch{
        res.redirect('/authors');
    }
});
Router.delete('/:id', async (req, res) => {
    // res.send('Delete Page' + req.params.id);
    let author;
    try {
        author = await Authors.findById(req.params.id);
        author.name = req.body.txtAuthorName;
        await author.remove();
        res.redirect('/authors');

    } catch (e) {
        if (author == null) {
            res.redirect('/');
        } else {
            console.log(e);
            res.redirect(`/authors/${author.id}`);
        }
    }
});
Router.put('/:id', async (req, res) => {
    let author;
    try {
        author = await Authors.findById(req.params.id);
        author.name = req.body.txtAuthorName;
        await author.save();
        res.redirect(`/authors/${author.id}`);

    } catch (e) {
        if (author == null) {
            res.redirect('/');
        } else {
            console.log(e);
            res.render('authors/authorEdit', {
                author: author,
                errorMessage: e
            });

        }
    }
});

module.exports = Router;