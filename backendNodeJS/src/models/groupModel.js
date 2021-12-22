const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    group_name: String, 
    topic_name: String,
    supervisor: {type: mongoose.Schema.ObjectId, ref: "Supervisor"},
    student_list: [{type: mongoose.Schema.ObjectId, ref: "Student"}]
})

const Group = mongoose.model('Group', groupSchema)

module.exports = Group;