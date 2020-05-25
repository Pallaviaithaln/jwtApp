var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var conf = require('../config');
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/add', addUser);
router.get('/byMob/:mob', getUserById);

function addUser(req, res, next) {
  if (req.body && req.body.mobile) {
    const user = req.body;
    // console.log(req.validatedUser, "user obj");
    user['otp'] = 1234; // generate random number
    MongoClient.connect(conf.database, (err, db) => {
      if (err) throw err;
      db.collection("users").insertOne((user), (error, result) => {
        if (result && result !== null) {
          console.log(result);
          res.json(result.ops[0]);
        } else res.json(error);
      });
    });
  } else res.json({ error: 'Provide user object' });

}

function getUserById(req, res, next) {
  if (req.params.mob) {
    MongoClient.connect(conf.database, (err, db) => {
      if (err) throw err;
      db.collection("users").findOne({ mobile: +req.params.mob }, (error, result) => {
        if (result && result !== null) {
          delete result.otp;
          res.json(result);
        } else res.json(error);
      });
    });
  } else res.json({ error: 'Provide Mobile Number' });
}


module.exports = router;
