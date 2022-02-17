const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    term: {type: String, required: true},
    question_type: {type: String, required: true, enum: ["Rating", "Text"]}
})

const Question = mongoose.model('Question', questionSchema)

module.exports = Question;