const mongoose=require('mongoose');

const usersSchema=mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    skill: {
        type: String,
        required: false
    }
});

module.exports=mongoose.model('user',usersSchema);