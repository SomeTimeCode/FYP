const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    password: String,
    role: {type: String, enum: ['Admin', 'Supervisor', 'Student'] ,required: true}
})

const User = mongoose.model('User', userSchema)

module.exports = User;