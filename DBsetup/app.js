const mongoose = require("mongoose")
const bcrypt = require('bcryptjs')
const User = require('./models/userModel')
const Admin = require('./models/adminModel')
const Supervisor = require('./models/supervisorModel')
const Student = require('./models/studentModel')
const Group = require('./models/groupModel')
const Topic = require('./models/topicModel')
require('dotenv').config();

const main = async() => {
    // connect to the mongoDB Atlas
    await mongoose.connect(process.env.DB_URI, {useNewUrlParser: true}).then(() => console.log(`db connected`)).catch((err) => {throw err})
    //Dropping all the collection exist in the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    collections.map((collection) => collection.name).forEach(async (collectionName) => {
        await mongoose.connection.db.dropCollection(collectionName);
    });
    //create the collections
    await User.createCollection();
    await Admin.createCollection();
    await Supervisor.createCollection();
    await Student.createCollection();
    await Group.createCollection();
    await Topic.createCollection();

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //create default student1 account
    var password = await bcrypt.hash('Student1', 10)
    var user = new User({
        username: 'Student1',
        password: password,
        contact: "student1@student.com",
        role: 'Student'
    })
    await user.save().then((obj) => {console.log(obj._id)}).catch( (err) => { throw err })
    var student = new Student({
        user: user._id
    })
    await student.save().then((obj) => {console.log(obj._id)}).catch( (err) => { throw err })

    //create default student2 account
    password = await bcrypt.hash('Student2', 10)
    user = new User({
        username: 'Student2',
        password: password,
        contact: "student2@student.com",
        role: 'Student'
    })
    await user.save().then((obj) => {console.log(obj._id)}).catch( (err) => { throw err })
    student = new Student({
        user: user._id
    })
    await student.save().then((obj) => {console.log(obj._id)}).catch( (err) => { throw err })

    //create default student3 account
    password = await bcrypt.hash('Student3', 10)
    user = new User({
        username: 'Student3',
        password: password,
        contact: "student3@student.com",
        role: 'Student'
    })
    await user.save().then((obj) => {console.log(obj._id)}).catch( (err) => { throw err })
    student = new Student({
        user: user._id
    })
    await student.save().then((obj) => {console.log(obj._id)}).catch( (err) => { throw err })

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //create default admin account
    password = await bcrypt.hash('Admin', 10)
    user = new User({
        username: 'Admin',
        password: password,
        contact: "admin@admin.com",
        role: 'Admin'
    })
    await user.save().then((obj) => {console.log(obj._id)}).catch( (err) => { throw err })
    var admin = new Admin({
        user: user._id
    })
    await admin.save().then((obj) => {console.log(obj._id)}).catch( (err) => { throw err })

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //create default supervisor1 account
    password = await bcrypt.hash('Supervisor1', 10)
    user = new User({
        username: 'Supervisor1',
        password: password,
        contact: "supervisor1@supervisor.com",
        role: 'Supervisor'
    })
    await user.save().then((obj) => {console.log(obj._id)}).catch( (err) => { throw err })
    var supervisor = new Supervisor({
        user: user._id
    })
    await supervisor.save().then((obj) => {console.log(obj._id)}).catch( (err) => { throw err })
    //Create Supervisor 1 topic
    var newTopic = new Topic({
        topic_name: "FYP Management System",
        short_description: "A system which fullfil the requirement for the parties to operate course selection and team management.",
        genre: ["Web/Mobile Application","AI"],
        number_group_member: 2,
        number_group: 2,
        supervisor: supervisor._id,
    })
    await newTopic.save().catch((err) => {throw err})
    newTopic = new Topic({
        topic_name: "Class Monitoring System",
        short_description: "A system which will report student's learning performance in class to the teacher",
        detail_description: "A system assisting teacher to operating home schooling due to covid",
        genre: ["Web/Mobile Application","AI"],
        number_group_member: 1,
        number_group: 2,
        supervisor: supervisor._id,
    })
    await newTopic.save().catch((err) => {throw err})
    newTopic = new Topic({
        topic_name: "Application for Class Scheduling",
        short_description: "Automatic scheduler for the officer to generate a class schedule for the semester",
        genre: ["Web/Mobile Application","AI"],
        number_group_member: 3,
        number_group: 2,
        supervisor: supervisor._id,
    })
    await newTopic.save().catch((err) => {throw err})
    newTopic = new Topic({
        topic_name: "Online learning through games",
        short_description: "A Website Learning Platform for primary student to learn with gaming",
        genre: ["Web/Mobile Application","Game Development"],
        number_group_member: 2,
        number_group: 2,
        supervisor: supervisor._id,
    })
    await newTopic.save().catch((err) => {throw err})


    //create supervisor2 account and topic
    password = await bcrypt.hash('Supervisor2', 10)
    user = new User({
        username: 'Supervisor2',
        password: password,
        contact: "supervisor2@supervisor.com",
        role: 'Supervisor'
    })
    await user.save().then((obj) => {console.log(obj._id)}).catch( (err) => { throw err })
    supervisor = new Supervisor({
        user: user._id
    })
    await supervisor.save().then((obj) => {console.log(obj._id)}).catch( (err) => { throw err })
    newTopic = new Topic({
        topic_name: "Financial News Collector",
        short_description: "A system which will collect financial news for the user to do invest analysis",
        genre: ["Web/Mobile Application","Fintech"],
        number_group_member: 1,
        number_group: 2,
        supervisor: supervisor._id,
    })
    await newTopic.save().catch((err) => {throw err})
    newTopic = new Topic({
        topic_name: "Automatic Bitcoin Manager",
        short_description: "A system which will automatic trading bitcoins",
        genre: ["Web/Mobile Application","Fintech","AI","Blockchains"],
        number_group_member: 1,
        number_group: 2,
        supervisor: supervisor._id,
    })
    await newTopic.save().catch((err) => {throw err})
    newTopic = new Topic({
        topic_name: "Cryptocurrencies Wallet",
        short_description: "Learn Cyptocurrencies through building",
        genre: ["Web/Mobile Application","Fintech","Blockchains"],
        number_group_member: 1,
        number_group: 2,
        supervisor: supervisor._id,
    })
    await newTopic.save().catch((err) => {throw err})

    //create Supervisor3 account and topic
    password = await bcrypt.hash('Supervisor3', 10)
    user = new User({
        username: 'Supervisor3',
        password: password,
        contact: "supervisor3@supervisor.com",
        role: 'Supervisor'
    })
    await user.save().then((obj) => {console.log(obj._id)}).catch( (err) => { throw err })
    supervisor = new Supervisor({
        user: user._id
    })
    await supervisor.save().then((obj) => {console.log(obj._id)}).catch( (err) => { throw err })
    newTopic = new Topic({
        topic_name: "Game development with Unity",
        short_description: "Building a Game Educating People to understand more about covid-19",
        genre: ["Web/Mobile Application","Game Development"],
        number_group_member: 1,
        number_group: 2,
        supervisor: supervisor._id,
    })
    await newTopic.save().catch((err) => {throw err})
    newTopic = new Topic({
        topic_name: "Automatic Puzzle Game Geneartor",
        short_description: "A automatic game generator which can extend the game's stages base on player progress",
        genre: ["Web/Mobile Application","Game Development","AI"],
        number_group_member: 1,
        number_group: 2,
        supervisor: supervisor._id,
    })
    await newTopic.save().catch((err) => {throw err})
    newTopic = new Topic({
        topic_name: "Mock trading Game",
        short_description: "Gain more experience in trading through mock pratice",
        genre: ["Web/Mobile Application","Game Development","Fintech"],
        number_group_member: 1,
        number_group: 2,
        supervisor: supervisor._id,
    })
    await newTopic.save().catch((err) => {throw err})
    newTopic = new Topic({
        topic_name: "Mobile Game for school promoting",
        short_description: "A mobile game to introduce the facilities and history of the university to the newbie",
        genre: ["Web/Mobile Application","Game Development"],
        number_group_member: 1,
        number_group: 2,
        supervisor: supervisor._id,
    })
    await newTopic.save().catch((err) => {throw err})

    //create Supervisor4 account and topic
    password = await bcrypt.hash('Supervisor4', 10)
    user = new User({
        username: 'Supervisor4',
        password: password,
        contact: "supervisor4@supervisor.com",
        role: 'Supervisor'
    })
    await user.save().then((obj) => {console.log(obj._id)}).catch( (err) => { throw err })
    supervisor = new Supervisor({
        user: user._id
    })
    await supervisor.save().then((obj) => {console.log(obj._id)}).catch( (err) => { throw err })
    newTopic = new Topic({
        topic_name: "A mobile application for schedule notifications",
        short_description: "Allowing people to set notificaiton to remind himself later on",
        genre: ["Web/Mobile Application"],
        number_group_member: 1,
        number_group: 2,
        supervisor: supervisor._id,
    })
    await newTopic.save().catch((err) => {throw err})
    newTopic = new Topic({
        topic_name: "Coding Game",
        short_description: "A mobile game application that allows people learn algorithm everywhere and everytime",
        genre: ["Web/Mobile Application","Game Development","AI"],
        number_group_member: 1,
        number_group: 2,
        supervisor: supervisor._id,
    })
    await newTopic.save().catch((err) => {throw err})
    newTopic = new Topic({
        topic_name: "Stock Trading Program",
        short_description: "A smart trading program to do investment",
        genre: ["Web/Mobile Application", "Fintech", "AI"],
        number_group_member: 1,
        number_group: 2,
        supervisor: supervisor._id,
    })
    await newTopic.save().catch((err) => {throw err})
    newTopic = new Topic({
        topic_name: "Team Management System",
        short_description: "A system which allow meeting scheduling and a job board to allow memebers to set team target",
        genre: ["Web/Mobile Application"],
        number_group_member: 1,
        number_group: 2,
        supervisor: supervisor._id,
    })
    await newTopic.save().catch((err) => {throw err})

    //create Supervisor5 account and topic
    password = await bcrypt.hash('Supervisor5', 10)
    user = new User({
        username: 'Supervisor5',
        password: password,
        contact: "supervisor5@supervisor.com",
        role: 'Supervisor'
    })
    await user.save().then((obj) => {console.log(obj._id)}).catch( (err) => { throw err })
    supervisor = new Supervisor({
        user: user._id
    })
    await supervisor.save().then((obj) => {console.log(obj._id)}).catch( (err) => { throw err })
    newTopic = new Topic({
        topic_name: "Online Social Networking Development",
        short_description: "Mobile social networking Application for the teenagers",
        genre: ["Web/Mobile Application"],
        number_group_member: 3,
        number_group: 1,
        supervisor: supervisor._id,
    })
    await newTopic.save().catch((err) => {throw err})
    newTopic = new Topic({
        topic_name: "Interview Management System",
        short_description: "A system to arrange interview and application",
        genre: ["Web/Mobile Application"],
        number_group_member: 3,
        number_group: 2,
        supervisor: supervisor._id,
    })
    await newTopic.save().catch((err) => {throw err})
    newTopic = new Topic({
        topic_name: "Game Development in Deep Learning",
        short_description: "Deep Learning in the future gaming enviornment to reduce hardware requirement ",
        genre: ["AI","Game Development"],
        number_group_member: 3,
        number_group: 2,
        supervisor: supervisor._id,
    })
    await newTopic.save().catch((err) => {throw err})
    newTopic = new Topic({
        topic_name: "Peer Assestment System",
        short_description: "A system to handle group contributions and peer assesments",
        genre: ["Web/Mobile Application","AI"],
        number_group_member: 2,
        number_group: 2,
        supervisor: supervisor._id,
    })
    await newTopic.save().catch((err) => {throw err})

    //create Supervisor6 account and topic
    password = await bcrypt.hash('Supervisor6', 10)
    user = new User({
        username: 'Supervisor6',
        password: password,
        contact: "supervisor6@supervisor.com",
        role: 'Supervisor'
    })
    await user.save().then((obj) => {console.log(obj._id)}).catch( (err) => { throw err })
    supervisor = new Supervisor({
        user: user._id
    })
    await supervisor.save().then((obj) => {console.log(obj._id)}).catch( (err) => { throw err })
    newTopic = new Topic({
        topic_name: "Blockchain in food safty",
        short_description: "Apply blockchians to ehance the food safty",
        detail_description: "Using the properties to ehance the food production record integrity",
        genre: ["Web/Mobile Application","Blockchains"],
        number_group_member: 2,
        number_group: 2,
        supervisor: supervisor._id,
    })
    await newTopic.save().catch((err) => {throw err})
    newTopic = new Topic({
        topic_name: "Investigating Trading Security",
        short_description: "Enhance the trading security",
        genre: ["Fintech"],
        number_group_member: 3,
        number_group: 2,
        supervisor: supervisor._id,
    })
    await newTopic.save().catch((err) => {throw err})
    newTopic = new Topic({
        topic_name: "Online product exchangeg system under COVID-19",
        short_description: "A platform to matching the user to exchange their unwatned goods",
        genre: ["Web/Mobile Application"],
        number_group_member: 3,
        number_group: 2,
        supervisor: supervisor._id,
    })
    await newTopic.save().catch((err) => {throw err})
    newTopic = new Topic({
        topic_name: "Big data and machine learning in central banking",
        short_description: "AI Statistics are useful for analysing economic status for central bank to issue policy",
        genre: ["Fintech","AI"],
        number_group_member: 1,
        number_group: 2,
        supervisor: supervisor._id,
    })
    await newTopic.save().catch((err) => {throw err})


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //disconnect to the database
    mongoose.disconnect(() => { console.log(`Disconnect to Database`)})
}

main()











































