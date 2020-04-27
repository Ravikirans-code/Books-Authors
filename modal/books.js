const mongoose = require('mongoose');
const path = require('path');
const Schema = mongoose.Schema;
const coverImageBasePath = 'uploads/bookCovers';

const bookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Authors'
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    coverImageName: {
        type: String,
        required: true
    },
    descripton: {
        type: String,
        required: true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now()
    }
});

bookSchema.virtual('coverImagePath').get(function(){
    if(this.coverImageName != null){
        return path.join('/',coverImageBasePath, this.coverImageName);
    }

});

module.exports = mongoose.model('Books', bookSchema);
module.exports.coverImageBasePath = coverImageBasePath;