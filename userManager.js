const express = require('express')
const app = express()
const path = require('path')
const port = 4000
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const studentList = fs.createReadStream('./data/students.json')



const mongoose = require('mongoose');
const dbConnectionString= 'mongodb://localhost:27017/userManager'; 
mongoose.connect(dbConnectionString, {useNewUrlParser: true,useUnifiedTopology: true,}); 
const db = mongoose.connection; //connecting to the Database

const userSchema = new mongoose.Schema({

    first_name: String,
    last_name: String,
    id: mongoose.Mixed,
    age: { type: Number, min: 1, max: 99 },
    email: String,
});

const User = mongoose.model('Users', userSchema)

db.on('error', (err) => {
    console.log(err)
})

db.on('connecting', () => console.log('Connecting'))

db.once('open', () => console.log('Connected, database is up'))


app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.set('views', './views')
app.set('view engine', 'pug')

app.get('/', (req, res) => {
    res.render('index.pug', {
        title: 'User Manager',
        subTitle: 'Adding Students',

    })
})

app.get('/listOfStudents', (req,res) => {
    fs.createReadStream('data/students.json').pipe(res)
 })

app.post('/addingStudent', (req, res) => {

    let user = new User() 
        user.first_name =  req.body.first_name;
        user.last_name =  req.body.last_name;
        user.id = uuidv4();
        user.markModified('id');
        user.age = req.body.age;
        user.email = req.body.email;
        user.save((err, data) => {
            if(err) {
                console.log(err)
            } 
            res.redirect('/studentList')
        })

        const info = require('./data/students.json')

        let userInfo = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            id: Math.floor(Math.random() * 100),
            age: req.body.age,
            email: req.body.email
        }    
    
        info.push(userInfo)
    
        fs.writeFile('./data/students.json', JSON.stringify(info), (err) => {
            if (err) throw err;
    
        })
})

app.get('/studentList', async (req, res) => {


    await User.find({}, (err, data) => {
        console.log(data)
        res.render('userPage.pug', {
            users: data
        })
    })
})

app.get('/editUser/:edit', async (req, res) => {

    await User.find({ id: req.params.edit }, (err, data) => {
        res.render('editUser.pug', {
            users: data
        })
        console.log(data)
    })

})

app.post('/editUser/:edit', async (req, res) => {

    const {first_name: newFirstName, last_name: newLastName, age: newAge, email: newEmail} = req.body
    
    await User.updateOne({id:req.params.edit}, {first_name: newFirstName, last_name: newLastName, age: newAge, email: newEmail})
        .then(
            (response) => {
                console.log('update complete', response);
            },
            (reject) => {
                console.log(reject)
            }
        );
        res.redirect('/studentList')
})



app.post('/removeUser/:delete', async (req, res) => {
    await User.findOneAndDelete({ id: req.params.delete })
    res.redirect('/studentList')
})

app.listen(port, err => {
    if (err) throw err;
    console.log('Listening on port 4000')
})