const Topic = require('../models/topicModel')
const Group = require("../models/groupModel")
const Supervisor = require("../models/supervisorModel")
const Student = require("../models/studentModel")
const User = require("../models/userModel")
const Question = require('../models/questionModel')
const PeerReviewForm = require('../models/peerReviewFormModel')
const StudentPeerReviewResponse = require('../models/studentPeerReviewResponseModel')
const bcrypt = require('bcryptjs')


// view fyp topic
const viewTopic = async (req, res) => {
    // need to chagne the logic
    try{
        if(req.query.topic_name == ""){
            var topic_name = { $ne: null }
        }else{
            var topic_name = { $regex: req.query.topic_name , $options: 'i' }
        }
        if(req.query.genre == ""){
            var genre = { $ne: null }
        }else{
            var genre_list = req.query.genre.split(",")
            var genre = {"$in" : genre_list.map((item) => {return item.replace("%20", " ")})}
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit
        const total_topics = await Topic.countDocuments({topic_name: topic_name, genre: genre}).catch((err) => {throw err})
        const total_pages = Math.ceil(total_topics / limit)
        var last = false
        if(page > total_pages){
            res.status(404).json({message: "Out of pages"})
            return
        }else if(page == total_pages){
            last = true
        }
        var topic_list = await Topic.find({topic_name: topic_name, genre: genre}).sort('topic_name').skip(skip).limit(limit).catch((err) => {throw err})
        res.status(200).json({topic_list: topic_list, last: last})
        return
    }catch(err){
        console.log(err)
        console.log("Error in viewing topics")
        res.status(400).json({error: err, message: "Error in viewing topics"})
        return
    }
}

const viewSpecificTopic = async (req, res) =>{
    try{
        var topic = await Topic.findOne({_id: req.params.id}).catch((err) => {throw err})
        if(topic){
            var {supervisor, __v, ...rest} = topic._doc
            var supervisor = await Supervisor.findOne({_id: topic.supervisor}).populate("user").catch((err) => {throw err})
            var student = await Student.findOne({user: req.decoded._id}).catch((err) => {throw err})
            var group_list = await Group.find({_id: {$in: rest.group}}).catch((err) => {throw err})
            // public_list record the the group is public or not {group_id: public/private}
            // group_list record the group's group member {group_id: group_member}
            var obj = {}
            var obj2= {}
            for(var i = 0; i < group_list.length; i++){
                var key = group_list[i]._id
                obj[key] = group_list[i].group_members
                obj2[key] = group_list[i].public
            }
            group_list = obj
            public_list = obj2
            // build the hashMap for student id to {username, contact}
            var member_list = Object.values(group_list).flat()
            member_list = await Student.find({_id: {$in: member_list}}).populate("user").catch((err) => {throw err})
            obj = {}
            for(var i = 0; i < member_list.length; i++){
                var key = member_list[i]._id
                obj[key] = {username: member_list[i].user.username, contact: member_list[i].user.contact}
            }
            member_list = obj
            // build the hashMap for group id to list of {username, contact}
            for (var key of Object.keys(group_list)) {
                group_list[key] = {member: group_list[key].map((item) => {return member_list[item]}), public: public_list[key]}
            }
            rest.group = group_list
            // console.log(rest.group)
            res.status(200).json({topic: rest, supervisor: {name: supervisor.user.username, contact: supervisor.user.contact}, student: {group: student.group} })
            return
        }else{
            res.status(400).json({message: "Specifici topic does not found"})
            return
        }
    }catch(err){
        console.log(err)
        console.log("Error in specific topic")
        res.status(400).json({error: err, message: "Error in creating group"})
        return
    }
}

const createGroup = async (req, res) => {
    try{
        var topic = await Topic.findOne({_id: req.body.id}).catch((err) => {throw err})
        var student = await Student.findOne({user: req.decoded._id}).catch((err) => {throw err})
        if(topic.number_group == 0){
            res.status(400).json({message: "No open group available now"})
        }
        var public = true
        var password = req.body.password
        if(req.body.password){
            password = await bcrypt.hash(req.body.password, 10)
            public = false
        }
        var group = new Group({
            group_name: `${req.body.group_name}_Pending`, 
            topic: topic._id,
            group_members: [student._id],
            supervisor: topic.supervisor,
            password: password,
            public: public 
        })
        await group.save().catch((err) => {throw err})
        topic.number_group = topic.number_group - 1
        topic.group.push(group._id)
        await topic.save().catch((err) => {throw err})
        student.group = group._id
        student.save().catch((err) => {throw err})
        res.status(200).json({message: "Group has been created"})
        return
    }catch(err){
        console.log(err)
        console.log("Error in creating group")
        res.status(400).json({error: err, message: "Error in creating group"})
        return
    }
}

const joinGroup = async (req, res) =>{
    try{
        if(req.body.group_name == null && req.body._id == null){
            console.log("Missing group information")
            res.status(400).json({message: "Missing group information"})
            return
        }else{
            if(req.body.group_name){
                var query = {group_name: req.body.group_name}
            }else{
                var query = {_id: req.body._id}
            }
            var group = await Group.findOne(query).populate("topic").catch((err) => {throw err})
            if(group.topic.number_gorup_member <= group.group_members.length){
                res.status(400).json({message: 'The group was full'})
                return
            }
            var student = await Student.findOne({user: req.decoded._id}).catch((err) => {throw err})
            if(group.public){
                group.group_members.push(student._id)
                group.save().catch((err) => {throw err})
                student.group = group._id
                student.save().catch((err) => {throw err})
                res.status(200).json({message: `Successfully join the group`})
                return
            }else{
                if(bcrypt.compareSync(req.body.password, group.password)){
                    group.group_members.push(student._id)
                    group.save().catch((err) => {throw err})
                    student.group = group._id
                    student.save().catch((err) => {throw err})
                    res.status(200).json({message: `Successfully join the group`})
                    return
                }else{
                    console.log("Wrong password")
                    res.status(400).json({message: "Wrong group password"})
                    return
                }
            }
        }
    }catch(err){
        console.log(err)
        console.log("Error in joining Group")
        res.status(400).json({error: err, message: "Error in joining Group"})
    }
}

// peer review form
const viewPeerReviewForm = async (req, res) => {
    try{
        var date = new Date()
        var query;
        if(date.getMonth > 8){
            query = { $gte: `${date.getFullYear()}-09-1`, $lte: `${date.getFullYear()+1}-06-1`}
        }else{
            query = { $gte: `${date.getFullYear()-1}-09-1`, $lte: `${date.getFullYear()}-06-1`}
        }
        var forms = await PeerReviewForm.find({ start_of_date: query }).catch((err) => {throw err})
        var student = await Student.findOne({user: req.decoded._id}).catch((err) => {throw err})
        // if student does not response then create new otherwise take old data
        var data = []
        console.log(forms.length)
        for(var i = 0; i < forms.length; i++){
            console.log(forms[i]._id)
            var studentPeerReviewResponse = await StudentPeerReviewResponse.findOne({peerReviewForm: forms[i]._id}).catch((err) => {throw err})
            console.log(!studentPeerReviewResponse)
            if(!studentPeerReviewResponse){
                studentPeerReviewResponse = new StudentPeerReviewResponse({
                    student: student._id,
                    peerReviewForm: forms[i]._id,
                    complete: false,
                    response: ''
                })
                await studentPeerReviewResponse.save().catch((err) => {throw err})
            }
            data.push({_id: studentPeerReviewResponse._id, start_of_date: forms[i].start_of_date, end_of_date: forms[i].end_of_date, term: forms[i].term, complete: studentPeerReviewResponse.complete})
        }
        res.status(200).json(data)
    }catch(err){
        res.status(400).json({message: "Unexpected Error in viewing peer review forms", error: err})
    }
}

// // genereate the warning 
// var student = await Student.findOne({user: req.decoded._id}).catch((err) => {throw err})
// var group = await Group.findOne({_id: student.group}).catch((err) => {throw err})
// var others = await Student.find({_id: {$in: group.group_members.filter(member=> !student._id.equals(member))}}).populate("user").catch((err) => {throw err})
// // memeber name list
// others = others.map(member => member.user.username)
// console.log(others)



const viewSpecificPeerReviewForm = async(req, res) => {
    try{
        var studentPeerReviewResponse = await StudentPeerReviewResponse.findOne({_id: req.params.id}).catch((err) => {throw err})
        var peerReviewForm = await PeerReviewForm.findOne({_id: studentPeerReviewResponse.peerReviewForm}).catch((err) => {throw err})
        var questionlist = await Question.find({_id: {$in: peerReviewForm.questions}}).catch((err) => {throw err})
        console.log(questionlist)
        var student = await Student.findOne({user: req.decoded._id}).catch((err) => {throw err})
        var group = await Group.findOne({_id: student.group}).catch((err) => {throw err})
        var others = await Student.find({_id: {$in: group.group_members.filter(member=> !student._id.equals(member))}}).populate("user").catch((err) => {throw err})
        var questions = []
        for(var i = 0; i < questionlist.length; i++){
            if(questionlist[i].question_to == 'Self'){
                questions.push({_id: questionlist[i]._id, question: questionlist[i].question, question_type: questionlist[i].question_type, question_required: questionlist[i].question_required, question_to: questionlist[i].question_to})
            }else{
                for(var j = 0; j < others.length; j++){
                    questions.push({_id: questionlist[i]._id.toString() + "-" + others[j].user.username, question: questionlist[i].question, question_type: questionlist[i].question_type, question_required: questionlist[i].question_required, question_to: others[j].user.username})    
                }
            }
        }
        console.log(questions)
        if(studentPeerReviewResponse.response == ''){
            var response = null
        }else{
            var response = JSON.parse(studentPeerReviewResponse.response)
        }
        console.log(response)
        res.status(200).json({student_response: response, questions: questions, term: peerReviewForm.term, start_of_date: peerReviewForm.start_of_date, end_of_date: peerReviewForm.end_of_date, submitted_response: studentPeerReviewResponse.response})
    }catch(err){
        console.log(err)
        res.status(400).json({message: "Unexpected Error in viewing peer review forms", error: err})
    }
}

const editSpecificPeerReviewForm = async(req, res) => {
    try{
        if(req.body.id != null){
            //generate the questions list to check the form complete or not
            var studentPeerReviewResponse = await StudentPeerReviewResponse.findOne({_id: req.body.id}).catch((err) => {throw err})
            console.log(studentPeerReviewResponse)
            var peerReviewForm = await PeerReviewForm.findOne({_id: studentPeerReviewResponse.peerReviewForm}).catch((err) => {throw err})
            var questionlist = await Question.find({_id: {$in: peerReviewForm.questions}}).catch((err) => {throw err})
            var student = await Student.findOne({user: req.decoded._id}).catch((err) => {throw err})
            var group = await Group.findOne({_id: student.group}).catch((err) => {throw err})
            var others = await Student.find({_id: {$in: group.group_members.filter(member=> !student._id.equals(member))}}).populate("user").catch((err) => {throw err})
            var questions = []
            for(var i = 0; i < questionlist.length; i++){
                if(questionlist[i].question_to == 'Self'){
                    questions.push({_id: questionlist[i]._id, question: questionlist[i].question, question_type: questionlist[i].question_type, question_required: questionlist[i].question_required, question_to: questionlist[i].question_to})
                }else{
                    for(var j = 0; j < others.length; j++){
                        questions.push({_id: questionlist[i]._id.toString() + "-" + others[j].user.username, question: questionlist[i].question, question_type: questionlist[i].question_type, question_required: questionlist[i].question_required, question_to: others[j].user.username})    
                    }
                }
            }
            var complete = true
            for(var i = 0; i < questions.length; i++){
                if(questions[i].question_required == true){
                    if(req.body.response[questions[i]._id] == null || req.body.response[questions[i]._id] == undefined){
                        complete = false
                        break;
                    }
                }
            }
            studentPeerReviewResponse["complete"] = complete
            studentPeerReviewResponse["response"] = JSON.stringify(req.body.response)
            console.log(studentPeerReviewResponse)
            await studentPeerReviewResponse.save().catch((err) => {throw err})
            res.status(200).json({complete: complete})
        }else{
            res.status(400).json({message: "Missing Student Review Form Number"})
        }        
    }catch(err){
        res.status(400).json({message: "Unexpected Error in viewing peer review forms", error: err})
    }
}

module.exports = { viewTopic, viewSpecificTopic, createGroup, joinGroup,
                   viewPeerReviewForm, viewSpecificPeerReviewForm, editSpecificPeerReviewForm
                 }