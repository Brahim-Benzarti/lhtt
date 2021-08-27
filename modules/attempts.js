const mongoose=require('mongoose');

const attemptsSchema=mongoose.Schema({
    ref: {
        type: String,
        required: true
    },
    text_ref: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    time_sec: {
        type: Number,
        required: true
    },
    err: {
        type: Number,
        required: true
    }
})

module.exports= mongoose.model('attempt', attemptsSchema);