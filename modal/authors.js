const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const book = require('./books');


const authorSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});
authorSchema.pre('remove', function (next) {
    book.find({ author: this.id }, (err, books) => {
        if(err){
            next(err);
        }else if(books.length > 0 ){
            next(new Error('This author has books still'));
        }else{
            next();
        }
    });
});

module.exports = mongoose.model('Authors', authorSchema);