const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email:{
        type:String, 
        required: true
    },
    password:{
        type: String,
        required: true,
    },
    name:{
        type:String ,
        required: true
    },
    status: {
        type:String, 
        required: true,
    },
    post:[{
        type: Schema.Types.ObjectId,
        // this is reference to a post and hence we have given the reference to Post model 
        ref: 'Post'
    }]
});



module.exports = mongoose.model('User' , userSchema);