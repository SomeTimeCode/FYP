const Group = require('../models/groupModel')
const Topic = require('../models/topicModel')
const Student = require('../models/studentModel')


// FYP Group controller
// pending group --> approve/merge
// group merge/split/add member can override the restriction 



























// FYP Topic controller
// topic create/update/detele/view
// need to do filtering may have bug
//forget to update supervisor fyp list as well

// *** delete need to change the group as well !
const viewTopic = async (req, res) => {
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
        const total_topics = await Topic.countDocuments({supervisor: req.decoded._id, topic_name: topic_name, genre: genre}).catch((err) => {throw err})
        const total_pages = Math.ceil(total_topics / limit)
        var last = false
        if(page > total_pages){
            console.log("Out of pages")
            res.status(404).json({message: "Out of pages"})
            return
        }else if(page == total_pages){
            last = true
        }
        var topic_list = await Topic.find({supervisor: req.decoded._id, topic_name: topic_name, genre: genre}).sort('topic_name').skip(skip).limit(limit).catch((err) => {throw err})
        res.status(200).json({topic_list: topic_list, last: last})
        return
    }catch(err){
        console.log(err)
        console.log("Error in viewing topics")
        res.status(400).json({error: err, message: "Error in viewing topics"})
        return
    }
}

// More work need to be done
const viewSpecificTopic = async (req, res) => {
    try{
        var topic = await Topic.findOne({_id: req.params.id}).catch((err) => {throw err})
        if(topic){
            if(topic.supervisor != req.decoded._id){
                res.status(400).json({message: "You have no right to view"})
                return
            }else{
                var {__v, supervisor, ...rest} = topic._doc
                // Need to generate the details of the group list
                console.log(rest)
                res.status(200).json(rest)
                return
            }
        }else{
            res.status(404).json({message: "Specific topic does not found"})
            return
        }
    }catch(err){
        console.log(err)
        console.log(`Error in viewing topic ${req.params.id}`)
        res.status(400).json({error: err, message: "Error in viewing specific topic"})
        return
    }
}

const createTopic = async (req, res) => {
    try{
        if(req.body.topic_name != null && req.body.short_description != null && req.body.number_group != null && req.body.genre != null && req.body.genre != [] && req.body.number_group_member != null){
            const detail_description = (req.body.detail_description == null ? req.body.short_description : req.body.detail_description )
            // check the topic name has been used or not
            var topic = await Topic.findOne({topic_name: req.body.topic_name}).catch(err => {throw err})
            if(topic){
                console.log(topic)
                res.status(400).json({message: "Topic Name has been used"})
                return
            }
            // new created Topic should allow at least on team to join
            var newTopic = new Topic({
                topic_name: req.body.topic_name,
                short_description: req.body.short_description,
                detail_description: detail_description,
                genre: req.body.genre,
                number_group_member: req.body.number_group_member,
                number_group: req.body.number_group,
                supervisor: req.decoded._id,
            })
            await newTopic.save().catch((err => {
                throw err
            }));
            res.status(200).json({message: "Topic is successful created"})
            return
        }else{
            console.log("Incomplete information for creating topic")
            res.status(400).json({message: "Incomplete information for creating topic"})
            return
        }
    }catch(err){
        console.log(err)
        console.log("Error in creating topics")
        res.status(400).json({error: err, message: "Error in creating topics"})
        return
    }
}

// update topic information 
const updateTopic = async (req, res) => {
    try{
        if(req.body.topic_name != null && req.body.short_description != null && req.body.number_group != null && req.body.genre != null && req.body.genre != [] && req.body._id != null && req.body.number_group_member != null){
            const detail_description = (req.body.detail_description == null ? req.body.short_description : req.body.detail_description )
            var topic = await Topic.findOne({topic_name: req.body.topic_name}).catch(err => {throw err})
            if(req.decoded._id != topic.supervisor){
                res.status(400).json({message: "You have no right to delete the topic"})
                return
            }
            console.log(topic)
            console.log(req.body._id)
            if(topic && topic._id != req.body._id){
                res.status(400).json({message: "topic exist"})
                return
            }
            await Topic.updateOne({ _id: req.body._id }, {
                topic_name: req.body.topic_name,
                short_description: req.body.short_description,
                detail_description: detail_description,
                genre: req.body.genre,
                number_group_member: req.body.number_group_member,
                number_group: req.body.number_group,
                supervisor: req.decoded._id,
            }).catch((err) => {
                throw err
            })
            res.status(200).json({message: "Topic is successful updated"})
        }else{
            console.log("Incomplete information for updating topic")
            res.status(400).json({message: "Incomplete information for updating topic"})
            return
        }
    }catch(err){
        console.log("Error in updating topic")
        console.log(err)
        res.status(400).json({error: err, message: "Error in updating topic"})
        return
    }
}


const deleteTopic = async (req, res) => {
    try{
        if(req.body._id != null){
            var topic = await Topic.findOne({_id: req.body._id}).catch((err) => {throw err})
            if(req.decoded._id != topic.supervisor){
                res.status(400).json({message: "You have no right to delete the topic"})
                return
            }
            var topic = await Topic.findOne({_id: req.body._id}).populate("group").catch((err) => {throw err })
            var group_list = topic.group.map((item) => {return item._id})
            var groups = await Group.find({_id : {$in: group_list}}).catch((err) => {throw err })
            var student_list = groups.map((item) => {return item.group_members}).flat()
            console.log(student_list)
            //clean the students' group
            await Student.updateMany({user : {$in: student_list}}, {$unset: {group: 1}}).catch((err) => {throw err })
            //clean the groups 
            await Group.deleteMany({_id : {$in: group_list}}).catch((err) => {throw err })
            //clean the topic
            await Topic.deleteOne({ _id: req.body._id }).catch((err) => { throw err })
            res.status(200).json({message: "Topic is successful deleted"})
            return
        }else{
            console.log("Incomplete information for deleting topic")
            res.status(400).json({message: "Incomplete information for deleting topic"})
            return
        }
    }catch(err){
        console.log("Error in deleting topic")
        console.log(err)
        res.status(400).json({error: err, message: "Error in deleting topic"})
        return
    }
}

module.exports = { viewTopic, viewSpecificTopic, createTopic, updateTopic, deleteTopic }