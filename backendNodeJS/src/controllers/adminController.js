const XLSX = require('xlsx')
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Supervisor = require('../models/supervisorModel');
const Student = require('../models/studentModel')


// const createAccounts = async(req, res)=>{
//     console.log("testing")
//     console.log(req.file.buffer)
//     res.status(200).json({message: "testing"})
// }

// assume the username does not duplicate in the excel file
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
        res.status(400).json({message: err})
    }
}




module.exports = { createAccounts }