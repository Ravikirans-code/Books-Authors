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
        console.log('searchOptions', searchOptions.title);
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
    renderFormPage(res, new Books(), 'new', errorMessage = false);
});

//Add books into mongo
Router.post('/', async (req, res) => {
    const book = new Books({
        title: req.body.txtTitle,
        author: req.body.sltAuthor,
        publishDate: new Date(req.body.txtPublishDate),
        pageCount: req.body.txtPageCount,
        description: req.body.txtaDescription,
    });
    saveCover(book, req.body.PageCover);
    // console.log(book);
    try {
        const newBook = await book.save();
        res.redirect('/books');
    } catch (e) {
        console.log(e);
        renderFormPage(res, book,'new', e);

    }

});

Router.get('/:id', async (req, res) => {
    try {
        const books = await Books.findById(req.params.id).populate('author').exec();
        res.render('books/view', { books: books });
    } catch{
        res.redirect('/');
    }
});
Router.get('/:id/edit', async (req, res) => {
    try {
        const books = await Books.findById(req.params.id).populate('author').exec();
        renderFormPage(res, books, 'edit', errorMessage = false);
    } catch (e) {
        renderFormPage(res, book, e);
    }
});
Router.delete('/:id', async (req, res) => {
    let book;
    try {
        book = await Books.findById(req.params.id);
        await book.remove();
        res.redirect('/books');
    } catch (e) {
        if (book == null) {
            res.redirect('/');
        } else {
            console.log(e);
            res.redirect(`/books/${book.id}`);
        }
    }
});

Router.put('/:id', async (req, res) => {
    let book
    try {
        book = await Books.findById(req.params.id);
        book.title = req.body.txtTitle;
        book.author = req.body.sltAuthor;
        book.publishDate = new Date(req.body.txtPublishDate);
        book.pageCount = req.body.txtPageCount;
        book.description = req.body.txtaDescription;
        if(req.body.PageCover != null && req.body.PageCover !== ''){
            saveCover(book, req.body.PageCover);
        }
        await book.save();
        res.redirect(`/books/${book.id}`);
    } catch (e) {
        if (book == null) {
            res.redirect('/');
        } else {
            console.log(e);
            res.redirect('/books');
        }

    }
});

function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return;
    const cover = JSON.parse(coverEncoded);
    if (cover != null && imageFormat.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64');
        book.coverImageType = cover.type;
    }

}

async function renderFormPage(res, book, form, errorMessage = false) {
    try {
        const authors = await Author.find({});
        let params = { authors: authors, book: book };
        if (errorMessage) {
            params.errorMessage = errorMessage;
        }

        res.render(`books/${form}`, params);
    } catch{
        res.redirect('/books');
    }
}
module.exports = Router;