const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require("mongoose");
const mongodb = require("mongodb")
const Schema = mongoose.Schema;
var bodyParser = require('body-parser')

mongoose.connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(process.env.MONGODB)


app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


let exerciseSchema = new mongoose.Schema({
  description: {type: String, required: true},
  duration: {type: Number, required: true},
  date: String
})

let userSchema = new mongoose.Schema({
  username: {type: String, required: true},
  log: [exerciseSchema]
})

let Session = mongoose.model("Session", exerciseSchema);
let User = mongoose.model("User", userSchema);



app.post("/api/exercise/new-user", bodyParser.urlencoded({ extended: false }), (req, res) => {
  // console.log(req.body);
  let newUser = new User({username: req.body.username})
  
  newUser.save((error, savedUser) => {
    if(!error){
      let responseObj = {};
      responseObj['username'] = savedUser.username;
      responseObj['_id'] = savedUser.id
      res.json(responseObj)
    }else{
      console.log(error)
    }
  })
  
})


app.get('/api/exercise/users', (req, res) => {
  //ussing {} empty object means retrun every obj in there
  User.find({}, (err, arrayOfUsers) => {
    if(!err){
      res.json(arrayOfUsers)
    }
})
})

app.post('/api/exercise/add', bodyParser.urlencoded({ extended: false }), (req, res) =>{
  //console.log(req.body)
  
  let newSession = new Session({
    description: req.body.description,
    duration: parseInt(req.body.duration),
    date: req.body.date
  })
  
  if(newSession.date === '') {
    newSession.date = new Date().toISOString().substring(0, 10)
  }
  
  User.findByIdAndUpdate(
    req.body.userId,
    {$push: {log: newSession}},
    {new: true},
    (error, updatedUser) => {
        if(!error){
            let resObject = {}
          resObject['_id'] = updatedUser.id
          resObject['username'] = updatedUser.username
          resObject['date'] = new Date(newSession.date).toDateString()
          resObject['description'] = newSession.description
          resObject['duration'] = newSession.duration
          res.json(resObject)
      }
        }
  )
  
})

app.get('/api/exercise/log', (req, res) => {
  //console.log(req.body)
  
  User.findById(
    req.query.userId,
    (error, results) => {
      if(!error) {
        let respObject = results;
        // let count = results.length;
        // let Object = {count, results};
        
        if(req.query.from || req.query.to) {
          let fromDate = new Date(0)
          let toDate = new Date()
          
          if(req.query.from) {
            fromDate = new Date(req.query.from)
          }
          if(req.query.to) {
            toDate = new Date(req.query.to)
          }
          
          fromDate = fromDate.getTime();
          toDate = toDate.getTime()
          
          respObject.log = respObject.log.filter((session) => {
            let sessionDate = new Date(session.date).getTime();
            return sessionDate >= fromDate && sessionDate <= toDate
            
          }) 
        }
        
        
   if(req.query.limit) {
          respObject.log = respObject.log.slice(0, req.query.limit)
        }
        let answer = {_id: respObject._id, username: respObject.username, log: respObject.log, count: respObject.log.length};

        // respObject['count'] = 10;
        
        res.json(answer)
      }
    }
  )
})
























































const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
