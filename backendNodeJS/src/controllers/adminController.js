const XLSX = require('xlsx')
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Supervisor = require('../models/supervisorModel');
const Student = require('../models/studentModel');
const Question = require('../models/questionModel')
const PeerReviewForm = require('../models/peerReviewFormModel')


const createAccounts = async(req, res) =>{
    try{
        console.log(req.file.buffer)
        var workbook = XLSX.read(req.file.buffer, {type: 'buffer'})
        let hashMap = {}
        let data = {}
        let completeData = []
        const temp = XLSX.utils.sheet_to_json(workbook.Sheets["CreateUsers"] , {raw: false})
        for(var i = 0; i < temp.length; i++){
            let res = temp[i]
            if(res.username == null && res.role == null && res.password == null && res.contact == null){
                continue
            }
            if(hashMap[res.username] != undefined){
                res.status(400).json({message: `duplicated username in ${res.__EMPTY}. Please make adjustment`})
                return
            }
            data[res.__EMPTY] = {"username": res.username, "password": res.password, "contact": res.contact, "role": res.role, "message": null}
            if(res.username == null){
                if (data[res.__EMPTY].message == null){
                    data[res.__EMPTY].message = "Missing Username;"
                }else{
                    data[res.__EMPTY].message = data[res.__EMPTY].message + "Missing Username;"
                }
            }
            if(res.password == null){
                if (data[res.__EMPTY].message == null){
                    data[res.__EMPTY].message = "Missing Password;"
                }else{
                    data[res.__EMPTY].message = data[res.__EMPTY].message + "Missing Password;"
                }
            }
            if(res.contact == null){
                if (data[res.__EMPTY].message == null){
                    data[res.__EMPTY].message = "Missing Contact;"
                }else{
                    data[res.__EMPTY].message = data[res.__EMPTY].message + "Missing Contact;"
                }
            }
            if(res.role == null){
                if (data[res.__EMPTY].message == null){
                    data[res.__EMPTY].message = "Missing Role;"
                }else{
                    data[res.__EMPTY].message = data[res.__EMPTY].message + "Missing Role;"
                }
            }
            if(res.username != null && res.role != null && res.contact != null && res.password != null){
                completeData.push(res.username)
                hashMap[res.username] = res.__EMPTY
            }
        }
        console.log(completeData)
        console.log(hashMap)
        //check completeData username has exist in the database or not
        var users = await User.find({"username": {"$in": completeData}}).catch((err) => {throw err})
        let usersList = []
        for(var i = 0; i < users.length; i++){
            usersList.push(users[i].username)
            if(data[hashMap[users[i].username]].message != null){
                data[hashMap[users[i].username]].message = data[hashMap[users[i].username]].message + "Username already exist in database;"
            }else{
                data[hashMap[users[i].username]].message = "Username already exist in database;"
            }
        }
        console.log(usersList)
        //filter out the exist people in the completData
        completeData = completeData.filter(user => !usersList.includes(user));
        console.log(completeData)
        //add the username that does not exist in the database
        for(var i = 0; i < completeData.length; i++){
            console.log(data[hashMap[completeData[i]]].role)
            if(data[hashMap[completeData[i]]].role == "Student"){
                let password = await bcrypt.hash(data[hashMap[completeData[i]]].password, 10)
                var user = new User({
                    username: data[hashMap[completeData[i]]].username,
                    password: password,
                    contact: data[hashMap[completeData[i]]].contact,
                    role: 'Student'
                })
                await user.save().then((obj) => {console.log(obj._id)}).catch((err) => {throw err})
                var student = new Student({
                    user: user._id
                })
                await student.save().then((obj) => {console.log(obj._id)}).catch((err) => {throw err})
                data[hashMap[completeData[i]]].message = "Success create"
            }else if(data[hashMap[completeData[i]]].role == "Supervisor"){
                let password = await bcrypt.hash(data[hashMap[completeData[i]]].password, 10)
                var user = new User({
                    username: data[hashMap[completeData[i]]].username,
                    password: password,
                    contact: data[hashMap[completeData[i]]].contact,
                    role: 'Supervisor'
                })
                await user.save().then((obj) => {console.log(obj._id)}).catch((err) => {throw err})
                var supervisor = new Supervisor({
                    user: user._id
                })
                await supervisor.save().then((obj) => {console.log(obj._id)}).catch((err) => {throw err})
                data[hashMap[completeData[i]]].message = "Success create"
            }else{
                //unknown role
                if (data[hashMap[completeData[i]]].message == null){
                    data[hashMap[completeData[i]]].message = "Unknown Role;"
                }else{
                    data[hashMap[completeData[i]]].message = data[hashMap[completeData[i]]].message + "Unknown Role;"
                }
            }
        }
        Object.keys(data).forEach((value) => {
            data[value] = {username: data[value].username, message: data[value].message}
        })
        res.status(200).json({fileName: req.file.originalname, data})
    }catch(err){
        console.log("check")
        res.status(400).json({message: err})
    }
}

const viewSpecificPeerReview = async(req, res) =>{
    try{
        var peerReviewForm = await PeerReviewForm.findOne({_id: req.params.id}).catch((err) => {throw err})
        var question_list = await Question.find({}).catch((err) => {throw err})
        var questionSubmit = []
        var questionBank = []
        question_list.forEach((question) => {
            if(peerReviewForm.questions.includes((question._id))){
                questionSubmit.push(question)
            }else{
                questionBank.push(question)
            }
        })
        console.log(peerReviewForm.start_of_date)
        console.log(new Date(peerReviewForm.start_of_date).toISOString().slice(0,10))
        res.status(200).json({questionSubmit: questionSubmit, questionBank: questionBank, term: peerReviewForm.term, start_of_date: new Date(peerReviewForm.start_of_date).toISOString().slice(0,10), end_of_date: new Date(peerReviewForm.end_of_date).toISOString().slice(0,10)})
    }catch(err){
        res.status(400).json({message: "Unexpected Error in viewing specific peer review", error: err})
    }
}

const editSpecificPeerReview = async(req, res) =>{
    try{
        if(req.body.startDate != null && req.body.endDate != null && req.body.term && req.body.questionSubmit != null && req.body.questionSubmit.length != 0 && req.body._id != null){
            let peerReviewForm = await PeerReviewForm.findOne({_id: req.body._id}).catch((err)=>{throw err})
            if(!peerReviewForm){
                res.status(400).json({message: "Peer Review Form can't find"})
                return
            }
            var question_list = req.body.questionSubmit.map((question) => {
                return question._id
            })
            let temp_peerReviewForm = await PeerReviewForm.findOne({term: req.body.term, questions: question_list, start_of_date: req.body.startDate, end_of_date: req.body.endDate}).catch((err)=>{throw err})
            if(temp_peerReviewForm){
                res.status(400).json({message: "Peer Review Form exists"})
                return
            }
            console.log(temp_peerReviewForm)
            peerReviewForm.start_of_date = req.body.startDate
            peerReviewForm.end_of_date = req.body.endDate
            peerReviewForm.term = req.body.term
            peerReviewForm.questions = question_list
            peerReviewForm.save().catch((err)=>{throw err})
            res.status(200).json({message: "Complete update the Peer Review Form"})
        }else{
            res.status(400).json({message: "Required infromtation does not completeted"})
        }
    }catch(err){
        res.status(400).json({message: "Unexpected Error in editing specific peer review", error: err})
    }
}

const viewPeerReview = async(req, res) => {
    try{
        let peerReviewForm = await PeerReviewForm.find({}).catch((err) => {throw err})
        if(!peerReviewForm){
            res.status(200).json({})
        }else{
            peerReviewForm = peerReviewForm.map((form) => {
                return {_id: form._id, term: form.term, questions: form.questions.length, start_of_date: form.start_of_date, end_of_date: form.end_of_date}
            })
            res.status(200).json(peerReviewForm)
        }
    }catch(err){
        res.status(400).json({message: "Unexpeected Error in viewing Peer Reviews", error: err})
    }
}

const createPeerReview = async(req, res) => {
    try{
        console.log(req.body)
        if(req.body.startDate != null && req.body.endDate != null && req.body.term && req.body.questionSubmit != null && req.body.questionSubmit.length != 0){
            console.log("check")
            var question_list = req.body.questionSubmit.map((question) => {
                                    return question._id
                                })
            var peerReviewForm = new PeerReviewForm({
                term: req.body.term,
                questions: question_list,
                start_of_date: req.body.startDate,
                end_of_date: req.body.endDate
            })
            await peerReviewForm.save().then((obj) => {console.log(obj._id)}).catch((err) => {throw err})
            res.status(200).json({"_id": peerReviewForm._doc._id})
        }else{
            res.status(400).json({message: "Incomplete information provided"})
        }
    }catch(err){
        res.status(400).json({message: "Unexpected Error in creating Peer Review Form"})
    }
}

// need to delete the student who refering to the form
const deleteSpecificPeerReviewForm = async(req, res) => {
    try{
        if(req.body._id != null){
            await PeerReviewForm.deleteOne({ _id: req.body._id }).catch((err) => { throw err })
            res.status(200).json({message: "Peer Review Form is successful deleted"})
        }else{
            res.status(400).json({message: "Incomplete Information provided"})
        }
    }catch(err){
        res.status(400).json({message: "Unexpected Error in deleting Peer Review Form", error: err})
    }
}

const createPeerReviewQuestion = async(req, res) => {
    try{
        console.log(req.body)
        if(req.body.question != null && req.body.question_type != null && req.body.question_to != null && req.body.question_required != null){
            if(req.body.question_required == 'True'){
                req.body.question_required = true
            }else if(req.body.question_required == 'False'){
                req.body.question_required = false
            }else{
                res.status(400).json({messgae: 'Unexpected question required restriction'})
                return
            }
            var question = await Question.findOne({question: req.body.question, question_to: req.body.question_to, question_type: req.body.question_type, question_required: req.body.question_required}).catch((err) => {throw err})
            if(question){
               res.status(409).json({message: "Question already exist"}) 
               return
            }
            question = new Question({
                question: req.body.question,
                question_to: req.body.question_to,
                question_type: req.body.question_type, 
                question_required: req.body.question_required
            })
            await question.save().then((obj) => {console.log(obj._id)}).catch((err) => {throw err})
            res.status(200).json({"_id": question._id, "question": req.body.question, "question_to": req.body.question_to, "question_type": req.body.question_type, "question_required": req.body.question_required})
        }else{
            res.status(400).json({message: "Required infromtation does not completeted"})
        }
    }catch(err){
        console.log(err)
        res.status(400).json({message: "Error in creating Peer Review Question", error: err})
    }
}

const viewPeerReviewQuestion = async(req, res) => {
    try{
        var questions_list = await Question.find({}).catch((err) => {throw err})
        questions_list = questions_list.map((data) => {
                            return {"_id": data._doc._id, "question_to": data._doc.question_to, "question": data._doc.question, "question_type": data._doc.question_type, "question_required": data._doc.question_required}
                        })
        res.status(200).json(questions_list)
    }catch(err){
        res.status(400).json({message: "Unexpected Error in viewing peer review questions", error: err})
    }
}

module.exports = { createAccounts, 
                   viewPeerReview, createPeerReview, viewSpecificPeerReview, editSpecificPeerReview, deleteSpecificPeerReviewForm,
                   createPeerReviewQuestion, viewPeerReviewQuestion
                 }