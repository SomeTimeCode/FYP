const Topic = require('../models/topicModel')


const createTopic = async (req, res) => {
    try{
        if(req.body.topic_name != null && req.body.short_description != null && req.body.number_group != null && req.body.genre != null && req.body.genre != []){
            const detail_description = (req.body.detail_description == null ? req.body.short_description : req.body.detail_description )
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

module.exports = { createTopic, updateTopic, deleteTopic }