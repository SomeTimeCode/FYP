const Topic = require('../models/topicModel')
const Group = require("../models/groupModel")
const Supervisor = require("../models/supervisorModel")
const Student = require("../models/studentModel")
const User = require("../models/userModel")
const bcrypt = require('bcryptjs')





// view fyp topic
const viewTopic = async (req, res) => {
    // new to chagne the logic
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit
        const total_topics = await Topic.countDocuments({}).catch((err) => {throw err})
        const total_pages = Math.ceil(total_topics / limit)
        var last = false
        if(page > total_pages){
            res.status(404).json({message: "Out of pages"})
            return
        }else if(page == total_pages){
            last = true
        }
        var topic_list = await Topic.find({}).sort('topic_name').skip(skip).limit(limit).catch((err) => {throw err})
        res.status(200).json({topic_list: topic_list, last: last})
        return
    }catch(err){
        console.log(err)
        console.log("Error in viewing topics")
        res.status(400).json({error: err, message: "Error in viewing topics"})
        return
    }
}

// new to add the group data as well 
const viewSpecificTopic = async (req, res) =>{
    try{
        console.log("here")
        var topic = await Topic.findOne({_id: req.params.id}).catch((err) => {throw err})
        if(topic){
            console.log(topic.supervisor)
            var user = await User.findOne({_id: topic.supervisor}).catch((err) => {throw err})
            console.log(user)
            res.status(200).json({topic: topic._doc, supervisor: {username: user._doc.username}})
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


// More work need to be done
const createGroup = async (req, res) => {
    try{
        var topic = await Topic.findOne({_id: req.body.id}).catch((err) => {throw err})
        if(topic.number_group == 0){
            res.status(400).json({message: "All the group has been filled up"})
        }
        var password = await bcrypt.hash(req.body.password, 10)
        var group = new Group({
            group_name: req.body.group_name, 
            topic: topic._id,
            group_members: [req.decoded._id],
            supervisor: topic.supervisor,
            password: password
        })
        await group.save().catch((err) => {throw err})
        topic.number_group = topic.number_group - 1
        topic.group.push(group._id)
        await topic.save().catch((err) => {throw err})
        var student = await Student.findOne({user: req.decoded._id}).catch((err) => {throw err})
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

module.exports = { viewTopic, viewSpecificTopic, createGroup }