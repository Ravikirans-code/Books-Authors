const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
});
// authorSchema.pre('remove', function (next) {
//     book.find({ author: this.id }, (err, books) => {
//         if(err){
//             next(err);
//         }else if(books.length > 0 ){
//             next(new Error('This author has books still'));
//         }else{
//             next();
//         }
//     });
// });

module.exports = mongoose.model('Users', userSchema);