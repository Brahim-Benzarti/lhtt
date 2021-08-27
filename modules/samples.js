const mongoose=require('mongoose');

const textschema=mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    creator: {
        type: String,
        required: false
    }
});

module.exports= mongoose.model('text', textschema);