const mongoose=require('mongoose');

const wordSchema=mongoose.Schema({
    word: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

module.exports=mongoose.model('word',wordSchema);