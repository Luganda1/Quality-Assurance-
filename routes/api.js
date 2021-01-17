/*
*
*
*       Complete the API routing below
*
*
*

'use strict';

const expect = require('chai').expect;
const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  
  let convertHandler = new ConvertHandler();

  app.route('/api/convert')
    .get(function (req, res){
      let input = req.query.input;
      let initNum = convertHandler.getNum(input);
      let initUnit = convertHandler.getUnit(input);
      let returnNum = convertHandler.convert(initNum, initUnit);
      let returnUnit = convertHandler.getReturnUnit(initUnit);
      let toString = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);

    
      if(initNum === 'invalid number' && initUnit === 'invalid unit'){
        res.json('invalid number and unit')
      }
    
      if(initNum === 'invalid number'){
        res.json('invalid number')
      } 
    
      if(initUnit === 'invalid unit'){
        res.json('invalid unit')
      }  
      //res.json
  
    

    
    
        let responseObject = {}
      responseObject['initNum'] = initNum
      responseObject['initUnit'] = initUnit
      responseObject['returnNum'] = returnNum
      responseObject['returnUnit'] = returnUnit
      responseObject['string'] = toString
    
      res.json(responseObject)
    });
};
*/

/*
 *
 *
 *       Complete the API routing below
 *
 *
 *

"use strict";

let expect = require("chai").expect;
let ConvertHandler = require("../controllers/convertHandler.js");

module.exports = function(app) {
  let convertHandler = new ConvertHandler();

  app.route("/api/convert").get(function(req, res) {
    let input = req.query.input;
    console.log(input + " input")
    let initNum = convertHandler.getNum(input);
    
    let initUnit = convertHandler.getUnit(input);
  console.log(initNum)
    console.log(initUnit + "Before")
    
    if (!initNum && !initUnit) {
       res.send("invalid number and unit");
      return;
    } else if (!initNum) {
      res.send('invalid number');
      return;
    } else if (!initUnit) {
      res.send("invalid unit");
      return; 
    }
    
    console.log(initUnit + " String")
    
    let returnNum = convertHandler.convert(initNum, initUnit);
    let returnUnit = convertHandler.getReturnUnit(initUnit);
    let toString = convertHandler.getString(
      initNum,
      initUnit,
      returnNum,
      returnUnit
    );

    let responseObject = {};
    responseObject["initNum"] = initNum;
    responseObject["initUnit"] = initUnit;
    responseObject["returnNum"] = returnNum;
    responseObject["returnUnit"] = returnUnit;
    responseObject["string"] = toString;

    res.json(responseObject);
  });
};
*/

"use strict";

const expect = require("chai").expect;
const ConvertHandler = require("../controllers/convertHandler.js");

module.exports = function(app) {
  let convertHandler = new ConvertHandler();

  app.route("/api/convert").get(function(req, res) {
    let input = req.query.input;
    let initNum = convertHandler.getNum(input);
    let initUnit = convertHandler.getUnit(input);
    console.log(initNum)
    if (!initNum && !initUnit) {
      res.send("invalid number and unit");
      return;
    } else if (!initNum) {
      res.send("invalid number");
      return;
    } else if (!initUnit) {
      res.send("invalid unit");
      return;
    }
    let returnNum = convertHandler.convert(initNum, initUnit);
    let returnUnit = convertHandler.getReturnUnit(initUnit);
    let toString = convertHandler.getString(
      initNum,
      initUnit,
      returnNum,
      returnUnit
    );

    //res.json
    res.json({ initNum, initUnit, returnNum, returnUnit, string: toString });
  });
};
