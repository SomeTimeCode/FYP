const Group = require('../models/groupModel')
const Topic = require('../models/topicModel')
const Student = require('../models/studentModel')
const User = require('../models/userModel')
const Supervisor = require('../models/supervisorModel')

// FYP Group controller
// pending group --> approve/merge
// group merge/split/add member can override the restriction
// get user only allow is under the same supervisor or no supervisor
// when make change if is new user or from other topic need to make change for those student
const viewTopicGroup = async (req, res) => {
    try{
        var supervisor = await Supervisor.findOne({user: req.decoded._id}).catch((err) => {throw err})
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
        const total_topics = await Topic.countDocuments({supervisor: supervisor._id, topic_name: topic_name, genre: genre}).catch((err) => {throw err})
        const total_pages = Math.ceil(total_topics / limit)
        var last = false
        if(page > total_pages){
            console.log("Out of pages")
            res.status(404).json({message: "Out of pages"})
            return
        }else if(page == total_pages){
            last = true
        }
        var topic_list = await Topic.find({supervisor:  supervisor._id, topic_name: topic_name, genre: genre}).populate("group").sort('topic_name').skip(skip).limit(limit).catch((err) => {throw err})
        //refine the data to response 
        topic_list = topic_list.map((topic) => {
            var {_id, topic_name, group, genre, short_description, ...rest} = topic
            var pending = group.some((group) => group.status == 'pending')
            return {_id: _id, topic_name: topic_name, genre: genre, short_description: short_description ,pending: pending}
        })
        console.log(topic_list)
        res.status(200).json({topic_list: topic_list, last: last})
        return
    }catch(err){
        console.log(err)
        console.log("Error in viewing topics")
        res.status(400).json({error: err, message: "Error in viewing topics"})
        return
    }
}

const viewSpecificTopicGroup = async (req, res) => {
    try{
        var topic = await Topic.findOne({_id: req.params.id}).populate("group").catch((err) => {throw err})
        console.log(topic)
        if(topic){
            var supervisor = await Supervisor.findOne({user: req.decoded._id}).catch((err) => {throw err})
            if(!topic.supervisor._id.equals(supervisor._id)){
                res.status(400).json({message: "You have no right to view"})
                return
            }else{
                let {_id, group, topic_name, ...rest} = topic
                console.log(_id)
                // Need to generate the details of the group list
                var pending_groups = []
                var approved_groups = []
                var student_list = []
                for(var i = 0; i < group.length; i++){
                    let {_id, group_members, group_name, status, ...rest} = group[i]
                    if(status == 'pending'){
                        pending_groups.push({_id: _id, group_members: group_members})
                    }else{
                        approved_groups.push({_id: _id, group_name: group_name, group_members: group_members.map((member) => {return {_id: member._id, belongs: _id, orignalGroup: _id}})})
                    }
                    student_list.push(group_members)
                }
                // genreate a hashMap id to name 
                var students = await Student.find({_id: {$in: student_list.flat()}}).populate("user").catch((err) => {throw err})
                var student_hashMap = {}
                for(var i = 0; i < students.length; i++){
                    student_hashMap[students[i]._id] = students[i].user.username
                }
                res.status(200).json({_id: _id, topic_name: topic_name, pending_groups: pending_groups, approved_groups: approved_groups, student_hashMap: student_hashMap})
                return
            }
        }else{
            res.status(404).json({message: "Specific topic does not found"})
            return
        }
    }catch(err){
        console.log(err)
        console.log("Error in viewing topics")
        res.status(400).json({error: err, message: "Error in viewing topics"})
    }
}

const approveGroup = async (req, res) => {
    try{
        if(req.body._id){
            var group = await Group.findOne({_id: req.body._id}).populate("topic").catch((err) => {throw err})
            var supervisor = await Supervisor.findOne({user: req.decoded._id}).catch((err) => {throw err})
            console.log(group)
            if(!group.supervisor._id.equals(supervisor._id)){
                console.log("You have no right to make change in this group")
                res.status(400).json({message: "You have no right to make change in this group"})
                return
            }
            group.group_name = `${group.topic.topic_name}_${group.topic.group.length}`
            group.status = "approve"
            group.save().catch((err)=>{throw err})
            res.status(200).json({message: "Group Approved"})
            return
        }else{
            console.log("Missing Group ID")
            res.status(400).json({message: "Missing Group ID"})
            return
        }
    }catch(err){
        console.log(err)
        console.log("Error in approving group")
        res.status(400).json({error: err, message: "Error in approving group"})
    }
}

const rejectGroup = async (req, res) => {
    try{
        if(req.body._id){
            var group = await Group.findOne({_id: req.body._id}).catch((err) => {throw err})
            var supervisor = await Supervisor.findOne({user: req.decoded._id}).catch((err) => {throw err})
            if(!group.supervisor._id.equals(supervisor._id)){
                console.log("group's supervisor not equal to supervisor id")
                res.status(400).json({message: "You have no right to make change in this group"})
                return
            }
            await Student.updateMany({_id : {$in: group.group_members}}, {$unset: {group: 1}}).catch((err) => {throw err })
            var topic = await Topic.findOne({_id: group.topic}).catch((err) => {throw err})
            topic.group.pull({_id: group._id})
            topic.number_group += 1
            topic.save().catch((err) => {throw err})
            await Group.deleteOne({ _id: req.body._id }).catch((err) => { throw err })
            res.status(200).json({message: "Group Approved"})
            return
        }else{
            console.log("Missing Group ID")
            res.status(400).json({message: "Missing Group ID"})
            return
        }
    }catch(err){
        console.log(err)
        console.log("Error in rejecting group")
        res.status(400).json({error: err, message: "Error in rejecting group"})
    }
}

const addStudent = async(req, res) => {
    try{
        if(req.body.input && req.body.topic_id){
            if(req.body.input.includes("@")){
                var query = {"contact": req.body.input}
            }else{
                var query = {"username": req.body.input}
            }
            var user = await User.findOne(query).catch((err) => {throw err})
            var user_student_id = await Student.findOne({user: user._id}).catch((err) => {throw err})
            var supervisor = await Supervisor.findOne({user: req.decoded._id}).catch((err) => {throw err})
            if(user){
                var student = await Student.findOne({user: user._id}).populate("group").catch((err) => {throw err})
                if(student.group){
                    //student with group
                    // same topic already or not under the supervisor
                    if(student.group.topic._id == req.body.topic_id){
                        res.status(400).json({message: "Student already in topic"})
                        return
                    }else if(!student.group.supervisor._id.equals(supervisor._id)){
                        res.status(400).json({message: "Student has another supervisor"})
                        return
                    }else{
                        res.status(200).json({username: user.username, _id: user_student_id._id, belongs: "none", orignalGroup: student.group._id})
                        return
                    }
                }else{
                    res.status(200).json({username: user.username, _id: user_student_id._id, belongs: "none", orignalGroup: "none"})
                    return
                }
            }else{
                console.log("Student not found")
                res.status(400).json({message: "Student not found"})
                return
            }
        }else{
            console.log("Missing Student name or contact")
            res.status(400).json({message: "Missing Student name or contact"})
            return
        }
    }catch(err){
        console.log(err)
        console.log("Error in Adding Student")
        res.status(400).json({error: err, message: "Error in Adding Student"})
    }
}


// have bug
const adjustGroup = async(req, res) => {
    try{
        let topic = await Topic.findOne({_id: req.body.topic_id}).catch((err) => {throw err})
        if(topic){
            if(req.body.approvedGroups){
                let approvedGroups = req.body.approvedGroups
                //create new group or update group 
                let student_list = []
                let hashGroup_id = {}
                let removeGroup = []
                let count = 1
                for(var i = 0; i < approvedGroups.length; i++){
                    let group = approvedGroups[i]
                    if(group.group_members.length == 0){
                        // only delete exist group
                        if(!group._id.includes("newGroup")){
                            await Group.deleteOne({_id: group._id}).catch((err) => {throw err})
                            removeGroup.push(group._id)
                        }else{
                            continue
                        }
                    }else if(group._id.includes("newGroup")){
                        // create new group
                        let newGroup = new Group({
                            status: "approve",
                            group_name: `${topic.topic_name}_${count}`, 
                            topic: topic._id,
                            group_members: group.group_members.map((member) => member._id),
                            supervisor: topic.supervisor,
                            public: true
                        })
                        hashGroup_id[group._id] = newGroup._id
                        await newGroup.save().catch((err) => {throw err})
                        count += 1
                    }else{
                        // update exist group
                        let existGroup = await Group.findOne({_id: group._id}).catch((err) => {throw err})
                        existGroup.group_name = `${topic.topic_name}_${count}`
                        existGroup.group_members = group.group_members.map((member) => member._id)
                        hashGroup_id[group._id] = existGroup._id
                        await existGroup.save().catch((err) => {throw err})
                        count+=1
                    }
                    student_list.push(group.group_members)
                }
                student_list = student_list.flat()
                for(var i = 0; i < student_list.length; i++){
                    let student = student_list[i]
                    if(student.belongs == student.orignalGroup){
                        continue
                    }else if(hashGroup_id[student.orignalGroup] == undefined && student.orignalGroup != "none" && !removeGroup.includes(student.orignalGroup)){
                        //student from other topic
                        var user = await Student.findOne({_id: student._id}).catch((err) => {throw err})
                        var orignalGroup = await Group.findOne({_id: user.group}).catch((err) => {throw err})
                        if(orignalGroup.group_members.length == 1 && orignalGroup.group_members[0]._id.equals(user._id)){
                            // delete the group and remove from the topic
                            var orignalTopic = await Topic.findOne({_id: orignalGroup.topic}).catch((err) => {throw err})
                            orignalTopic.group = orignalTopic.group.filter((group) => (!group.equals(orignalGroup._id)))                            
                            await orignalTopic.save().catch((err) => {throw err})
                            await Group.deleteOne({_id: orignalGroup._id}).catch((err) => {throw err})
                        }else if(orignalGroup.group_members.length > 1){
                            orignalGroup.group_members = orignalGroup.group_members.filter(student => !student.equals(user._id))
                            await orignalGroup.save().catch((err) => {throw err})
                        }else{
                            throw new Error(`something wrong with the orignalGroup`)
                        }
                        user.group = hashGroup_id[student.belongs]
                        await user.save().catch((err)=>{throw err})
                    }else{
                        console.log("ok")
                        // normal update the student
                        var user = await Student.findOne({_id: student._id}).catch((err) => {throw err})
                        user.group = hashGroup_id[student.belongs]
                        await user.save().catch((err) => {throw err})
                    }
                }
                topic.group = Object.values(hashGroup_id)
                await topic.save().catch((err) => {throw err})
                res.status(200).json({message: "Sucess update"}) 
            }else{
                console.log("Adjust data is missing")
                res.status(400).json({message: "Adjust data is missing"})
                return
            }
        }else{
            console.log("Topic not found")
            res.status(400).json({message: "Topic not found"})
            return
        }
    }catch(err){
        console.log(err)
        console.log("Error in Adjusting Group")
        res.status(400).json({error: err, message: "Error in Adjusting Group"})
    }
}






// FYP Topic controller
// topic create/update/detele/view
// need to do filtering may have bug
//forget to update supervisor fyp list as well

// *** delete need to change the group as well !
const viewTopic = async (req, res) => {
    try{
        var supervisor = await Supervisor.findOne({user: req.decoded._id}).catch((err) => {throw err})
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
        const total_topics = await Topic.countDocuments({supervisor: supervisor._id, topic_name: topic_name, genre: genre}).catch((err) => {throw err})
        const total_pages = Math.ceil(total_topics / limit)
        var last = false
        if(page > total_pages){
            console.log("Out of pages")
            res.status(404).json({message: "Out of pages"})
            return
        }else if(page == total_pages){
            last = true
        }
        var topic_list = await Topic.find({supervisor: supervisor._id, topic_name: topic_name, genre: genre}).sort('topic_name').skip(skip).limit(limit).catch((err) => {throw err})
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
            var supervisor = await Supervisor.findOne({user: req.decoded._id}).catch((err) => {throw err})
            if(!topic.supervisor._id.equals(supervisor._id)){
                console.log(topic.supervisor)
                console.log(supervisor)
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
            const detail_description = (req.body.detail_description == '' ? req.body.short_description : req.body.detail_description )
            // reject the creation if the topic name is duplicated
            var topic = await Topic.findOne({topic_name: req.body.topic_name}).catch(err => {throw err})
            if(topic){
                console.log(topic)
                res.status(400).json({message: "Topic Name is exist"})
                return
            }
            //find the supervisor id
            var supervisor = await Supervisor.findOne({user: req.decoded._id}).catch((err) => {throw err})
            // create new topic for the supervisor
            var newTopic = new Topic({
                topic_name: req.body.topic_name,
                short_description: req.body.short_description,
                detail_description: detail_description,
                genre: req.body.genre,
                number_group_member: req.body.number_group_member,
                number_group: req.body.number_group,
                supervisor: supervisor._id,
            })
            await newTopic.save().catch((err) => {throw err})
            res.status(200).json({message: "Topic is successfully created"})
            return
        }else{
            console.log("Incomplete information for creating topic")
            res.status(400).json({message: "Incomplete information for creating topic"})
            return
        }
    }catch(err){
        console.log(err)
        console.log("Unexpected Error in creating Topic")
        res.status(400).json({error: err, message: "Unexpected Error in creating Topic"})
        return
    }
}

const updateTopic = async (req, res) => {
    try{
        if(req.body.topic_name != null && req.body.short_description != null && req.body.number_group != null && req.body.genre != null && req.body.genre != [] && req.body._id != null && req.body.number_group_member != null){
            const detail_description = (req.body.detail_description == '' ? req.body.short_description : req.body.detail_description)
            var topic = await Topic.findOne({topic_name: req.body.topic_name}).catch(err => {throw err})
            var supervisor = await Supervisor.findOne({user: req.decoded._id}).catch((err) => {throw err})
            if(!topic.supervisor._id.equals(supervisor._id)){
                res.status(400).json({message: "You have no right to adjust the topic"})
                return
            }
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
                supervisor: supervisor._id,
            }).catch((err) => {
                throw err
            })
            res.status(200).json({message: "Topic is successfully updated"})
            return
        }else{
            console.log("Incomplete information for updating topic")
            res.status(400).json({message: "Incomplete information for updating topic"})
            return
        }
    }catch(err){
        console.log("Unexpected Error in updating topic")
        console.log(err)
        res.status(400).json({error: err, message: "Unexpected Error in updating topic"})
        return
    }
}

const deleteTopic = async (req, res) => {
    try{
        if(req.body._id != null){
            var supervisor = await Supervisor.findOne({user: req.decoded._id}).catch((err) => {throw err})
            var topic = await Topic.findOne({_id: req.body._id}).catch((err) => {throw err})
            if(!topic.supervisor._id.equals(supervisor._id)){
                res.status(400).json({message: "You have no right to delete the topic"})
                return
            }
            var topic = await Topic.findOne({_id: req.body._id}).populate("group").catch((err) => {throw err })
            var group_list = topic.group.map((item) => {return item._id})
            var groups = await Group.find({_id : {$in: group_list}}).catch((err) => {throw err })
            var student_list = groups.map((item) => {return item.group_members}).flat()
            //clean the students' group
            await Student.updateMany({_id : {$in: student_list}}, {$unset: {group: 1}}).catch((err) => {throw err })
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

module.exports = { 
                    viewSpecificTopicGroup, viewTopicGroup, approveGroup, rejectGroup, addStudent, adjustGroup,
                    viewTopic, viewSpecificTopic, createTopic, updateTopic, deleteTopic 
                }