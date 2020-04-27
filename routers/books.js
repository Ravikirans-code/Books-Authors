const express = require('express');
const Router = express.Router();
const Author = require('../modal/authors');
const Books = require('../modal/books');
const multer = require('multer');
const path = require('path');

var fs = require('fs');
// var gutil = require('gulp-util');

const uploadPath = path.join('public', Books.coverImageBasePath);
const imageFormat = ['image/jpeg', 'image/png', 'image/jpg']

const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageFormat.includes(file.mimetype))

    }
});

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
Router.post('/', upload.single('PageCover'), async (req, res) => {
    const filename = req.file != null ? req.file.filename : null;
    const book = new Books({
        title: req.body.txtTitle,
        author: req.body.sltAuthor,
        publishDate: new Date(req.body.txtPublishDate),
        pageCount: req.body.txtPageCount,
        coverImageName: filename,
        descripton: req.body.txtaDescription,
    });
    console.log(req.file);
    try {
        const newBook = await book.save();
        res.redirect('/books');
    } catch (e) {
        fs.unlink(path.join(uploadPath, filename), err => {
            console.log(err);
        });
        // fs.exists(path.join(uploadPath, filename), function (exists) {
        //     if (exists) {
        //         //Show in green
        //         // console.log(gutil.colors.green('File exists. Deleting now ...'));
        //         fs.unlink(path.join(uploadPath, filename), err => {
        //             console.log(err);
        //         });
        //     } else {
        //         //Show in red
        //         // console.log(gutil.colors.red('File not found, so not deleting.'));
        //     }
        // });
        renderNewPage(res, book, e);

    }

});

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