const mongoose = require('mongoose');

const supervisorSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.ObjectId, ref: "User"},
    group_List: [{type: mongoose.Schema.ObjectId, ref: "Group"}]
})

const Supervisor = mongoose.model('Supervisor', supervisorSchema)

module.exports = Supervisor;