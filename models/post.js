const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const postSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    imageUrl:{
        type:String,
        required: true,
    },
    content:{
        type: String, 
        required: true,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        // we are doing this as we want to allow delete only from the user who created it
        required: true,
    }
}, {timestamps: true})

module.exports = mongoose.model('Post' , postSchema)