const Topic = require('../models/topicModel')



// FYP Topic controller
// topic create/update/detele/view

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
        var topic_list = await Topic.find().sort('topic_name').skip(skip).limit(limit).catch((err) => {throw err})
        res.status(200).json({topic_list: topic_list, last: last})
        return
    }catch(err){
        console.log(err)
        console.log("Error in viewing topics")
        res.status(400).json({error: err, message: "Error in viewing topics"})
        return
    }
}

const viewSpecificTopic = async (req, res) => {
    try{
        console.log("here")
        var topic = await Topic.findOne({_id: req.params.id}).catch((err) => {throw err})
        if(topic){
            var {__v, supervisor, group, ...rest} = topic._doc
            console.log(rest)
            res.status(200).json(rest)
            return
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
        if(req.body.topic_name != null && req.body.short_description != null && req.body.number_group != null && req.body.genre != null && req.body.genre != []){
            const detail_description = (req.body.detail_description == null ? req.body.short_description : req.body.detail_description )
            // check topic name is exist or not
            var topic = await Topic.findOne({topic_name: req.body.topic_name}).catch(err => {throw err})
            if(topic){
                console.log(topic)
                res.status(400).json({message: "topic exist"})
                return
            }
            var newTopic = new Topic({
                topic_name: req.body.topic_name,
                short_description: req.body.short_description,
                detail_description: detail_description,
                genre: req.body.genre,
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

const updateTopic = async (req, res) => {
    try{
        if(req.body.topic_name != null && req.body.short_description != null && req.body.number_group != null && req.body.genre != null && req.body.genre != [] && req.body._id){
            const detail_description = (req.body.detail_description == null ? req.body.short_description : req.body.detail_description )
            var topic = await Topic.findOne({topic_name: req.body.topic_name}).catch(err => {throw err})
            if(topic){
                console.log(topic)
                res.status(400).json({message: "topic exist"})
                return
            }
            await Topic.updateOne({ _id: req.body._id }, {
                topic_name: req.body.topic_name,
                short_description: req.body.short_description,
                detail_description: detail_description,
                genre: req.body.genre,
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
            await Topic.deleteOne({ _id: req.body._id }).catch((err) => {
                throw err
            })
            res.status(200).json({message: "Topic is successful deleted"})
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