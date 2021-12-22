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
    //create default student account
    var password = await bcrypt.hash('Student', 10)
    var user = new User({
        username: 'Student',
        password: password,
        role: 'Student'
    })
    await user.save().then((obj) => {console.log(obj._id)}).catch( (err) => { throw err })
    var student = new Student({
        user: user._id
    })
    await student.save().then((obj) => {console.log(obj._id)}).catch( (err) => { throw err })
    //create default admin account
    password = await bcrypt.hash('Admin', 10)
    user = new User({
        username: 'Admin',
        password: password,
        role: 'Admin'
    })
    await user.save().then((obj) => {console.log(obj._id)}).catch( (err) => { throw err })
    var admin = new Admin({
        user: user._id
    })
    await admin.save().then((obj) => {console.log(obj._id)}).catch( (err) => { throw err })
    //create default supervisor account
    password = await bcrypt.hash('Supervisor', 10)
    user = new User({
        username: 'Supervisor',
        password: password,
        role: 'Supervisor'
    })
    await user.save().then((obj) => {console.log(obj._id)}).catch( (err) => { throw err })
    var supervisor = new Supervisor({
        user: user._id
    })
    await supervisor.save().then((obj) => {console.log(obj._id)}).catch( (err) => { throw err })
    //disconnect to the database
    mongoose.disconnect(() => { console.log(`Disconnect to Database`)})
}

main()











































