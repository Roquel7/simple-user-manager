const express = require('express')
const app = express()
const port = 4000
const fs = require('fs')
const studentList = fs.createReadStream('./data/students.json')
// const newList = fs.createWriteStream('./data/newStudentList.json')
let list = []

// class Student {
//     super()
//     this.
// }

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static('public'))

app.get('/listOfStudents', (req,res) => {
   fs.createReadStream('data/students.json').pipe(res)
})

app.post('/addStudent', (req, res) => {
    let user = 
`{
    "name": "${req.body.full_name}",
    "id": "${Math.floor(Math.random() * 100)}",
    "age": "${req.body.age}",
    "email": "${req.body.email}"
},`

    // list.push(data)

    res.send(user)

    // console.log(user)
    // let data = JSON.stringify(user, null, 2)
    // console.log(data)

    
    // let finalList = JSON.stringify(list)
    // studentList.pipe(newList)
    // newList.write(data)

    let info = require('./data/students.json')

    info.push(user)


    fs.writeFile('./data/newStudentList.json', JSON.stringify(info), (err) => {
        if (err) throw err;
        
    })

})

app.listen(port, err => {
    if (err) throw err;
    console.log('Listening on port 3000')
})
