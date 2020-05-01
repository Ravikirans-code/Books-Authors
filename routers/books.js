const express = require('express');
const Router = express.Router();
const Author = require('../modal/authors');
const Books = require('../modal/books');

const imageFormat = ['image/jpeg', 'image/png', 'image/jpg']

//All Books Route
Router.get('/', async (req, res) => {
    let searchOptions = {};
    if (req.query.txtSearchBooks != null && req.query.txtSearchBooks !== '') {
        searchOptions.title = new RegExp(req.query.txtSearchBooks, 'i');
    }

    if (req.query.txtPublishedBefore != null && req.query.txtPublishedBefore !== '') {
        searchOptions.txtPublishedBefore = req.query.txtPublishedBefore;
    }
    if (req.query.txtPublishedAfter != null && req.query.txtPublishedAfter !== '') {
        searchOptions.txtPublishedAfter = req.query.txtPublishedAfter
    }
    let allBooks = {};
    try {
        console.log('searchOptions',searchOptions.title);
        if (searchOptions.title != null) {
            allBooks = await Books.find({ "title": searchOptions.title, "publishDate": { "$gte": searchOptions.txtPublishedBefore, "$lte": searchOptions.txtPublishedAfter } });
        } else {
            allBooks = await Books.find({});
        }
        res.render('books/index', { allBooks: allBooks, searchOptions: req.query });
    } catch{
        res.send('Can\'t find books');

    }

});


//Create books route
Router.get('/new', async (req, res) => {
    renderNewPage(res, new Books());
});

//Add books into mongo
Router.post('/', async (req, res) => {
    const book = new Books({
        title: req.body.txtTitle,
        author: req.body.sltAuthor,
        publishDate: new Date(req.body.txtPublishDate),
        pageCount: req.body.txtPageCount,
        descripton: req.body.txtaDescription,
    });
    saveCover(book, req.body.PageCover);
    // console.log(book);
    try {
        const newBook = await book.save();
        res.redirect('/books');
    } catch (e) {
        renderNewPage(res, book, e);

    }

});

function saveCover(book, coverEncoded){
    if(coverEncoded == null) return;
    const cover = JSON.parse(coverEncoded);
    if(cover != null && imageFormat.includes(cover.type)){
        book.coverImage = new Buffer.from(cover.data, 'base64');
        book.coverImageType = cover.type;
    }

}

async function renderNewPage(res, book, errorMessage = false) {
    try {
        const authors = await Author.find({});
        const book = new Books()
        let params = { authors, book };
        if (errorMessage) {
            params.errorMessage = errorMessage;
        }
        res.render('books/new', params);
    } catch{
        res.redirect('/books');
    }
}
module.exports = Router;