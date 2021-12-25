const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    group_name: {type: String, unique: true}, 
    topic: {type: mongoose.Schema.ObjectId, ref: "Topic"},
    group_memebers: [{type: mongoose.Schema.ObjectId, ref: "Student"}],
    supervisor: {type: mongoose.Schema.ObjectId, ref: "Supervisor"},
    password: String
})

const Group = mongoose.model('Group', groupSchema)

module.exports = Group;