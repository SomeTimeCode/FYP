const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    topic_name: {type: String, required: true},
    short_description: {type: String, required: true},
    detail_description: String,
    genre: {type: [String], enum: ["Web/Mobile Application", "AI", "BlockChains", "Fintech", "Game Development", "Others"]},
    number_group: Number,
    group: [{type: mongoose.Schema.ObjectId, ref: "Group"}],
    supervisor: {type: mongoose.Schema.ObjectId, ref: "Supervisor"},
})

const Topic = mongoose.model('Topic', topicSchema)

module.exports = Topic;