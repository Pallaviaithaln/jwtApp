var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var jwt = require('jsonwebtoken');
var conf = require('../config');

router.get('/', function (req, res, next) {
    res.send('auth');
});

router.post('/login', login);

function login(req, res, next) {
    // const payload = req.body;
    if (req.body.mobile && req.body.otp) {
        MongoClient.connect(conf.database, (err, db) => {
            if (err) res.json(err);
            db.collection("users").findOne({ mobile: +req.body.mobile, otp: +req.body.otp }, (error, result) => {
                if (result && result !== null) {
                    result.token = jwt.sign({ mobile: result.mobile }, conf.secret, { expiresIn: 86400 });
                    console.log('Got jwt');
                    res.json({ result });
                }
                else {
                    res.json({ error: 'Login failed' });
                }
            });
        });
    } else res.json({ error: 'Provide both mobile and otp' });
}

var jwtValidation = (req, res, next) => {
    const token = req.headers['auth-token'] || req.query.token;
    if (token) {
        jwt.verify(token, conf.secret, (err, decodedResult) => {
            if (err) {
                res.status(401);
                res.send("Invalid Token");
            } else {
                req.validatedUser = decodedResult;
                next();
            }
            // console.log(token, decodedResult, "got token"); 
        });
    } else res.json('Provide Proper Token in header with \'auth-token\' or param with token');

}
module.exports = { authrouter: router, jwtValidation: jwtValidation };
