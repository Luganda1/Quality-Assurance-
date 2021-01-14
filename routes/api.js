'use strict';

const mongodb = require('mongodb')
const mongoose = require('mongoose')
const uri = process.env.MONGO_URI;

//console.log(uri)
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let issueSchema = new mongoose.Schema({
    issue_title: {type: String, required: true},
    issue_text: {type: String, required: true},
    created_by : {type: String, required: true},
    assigned_to : String,
    status_text : String,
    open: {type: Boolean, required: true},
    created_on: {type: Date, required: true},
    updated_on: {type: Date, required: true},
    project: String
  })

  let Issue = mongoose.model('Issue', issueSchema)


module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
    let filterObject = Object.assign(req.query)
    filterObject['project'] = project
      Issue.find(filterObject, (err, arrayOfIssues) => {
          if(!err && arrayOfIssues){
            res.json(arrayOfIssues)
          }
      })
    })
    
    .post(function (req, res){
       var project = req.params.project;
    
      if(!req.body.issue_title || !req.body.issue_text || !req.body.created_by){
        res.json({ error: 'required field(s) missing' })
      }

    
        let newIssue = new Issue({
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_by: req.body.created_by,
          assigned_to: req.body.assigned_to || '',
          status_text: req.body.status_text || '',
          open: true,
          created_on: new Date().toUTCString(),
          updated_on: new Date().toUTCString(),
          project: project
        })
      
        newIssue.save((error, savedIssue) => {
          if(!error && savedIssue) {
            // console.log(savedIssue)
            res.json(savedIssue)
          }
        })
    })
  
    
  .put(function (req, res){
      let project = req.params.project;
      let updatedObject = {}
      
      Object.keys(req.body).forEach((key) => {
        if(req.body[key] != ''){
          updatedObject[key] = req.body[key]
          }
        })
      if(Object.keys(updatedObject).length < 2){
          return res.json('no update field sent')
      }    
  
    updatedObject['updated_on'] = new Date().toUTCString()
    // console.log(updatedObject)
    
      Issue.findByIdAndUpdate(
      req.body._id,
      updatedObject,
      {new: true},
      (error, updatedIssue) => {
      if(!error && updatedIssue){
          return res.json({  result: 'successfully updated', '_id': updatedIssue._id })
        }else if(!updatedIssue){
          return res.json('could not update '+ req.body._id)
        } else if(!updatedIssue._id) {
          return res.json({ error: 'missing _id' })
        }
      }
    )
  })
    
    // .delete(function (req, res){
    //   let project = req.params.project;
    //   if(!req.body._id){
    //       res.json({ error: 'missing _id' })
    //     }
    // Issue.findByIdAndRemove(req.body._id, (err, deletedIssue) => {
    //   if(!err && deletedIssue){
    //       res.json({ result: 'successfully deleted' + deletedIssue.id })
    //   }
    //   else if(!deletedIssue){
    //     res.json({ error: 'could not delete ' + req.body._id })
    //   }
    // })
    // });
    
  .delete(function (req, res){
  var project = req.params.project;
  if(!req.body._id){
    res.json('id error')
  }
  Issue.findByIdAndRemove(req.body._id, (error, deletedIssue) => {
    if(!error && deletedIssue){
      res.json( 'deleted '+ deletedIssue.id)
    }else if(!deletedIssue){
      res.json('could not delete '+ req.body._id)
    }
  })
});
  
  
};
