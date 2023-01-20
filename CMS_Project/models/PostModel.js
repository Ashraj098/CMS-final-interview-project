const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    
    title: {
        type: String,
        required: false
    },
      
    file: {
        type: String,
        default: ''
    },

    description: {
        type: String,
        required: false
    },
    
    creationDate: {
        type: Date,
        default: Date.now()
    },
    
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
 
});

module.exports = {Post: mongoose.model('post', PostSchema )};
