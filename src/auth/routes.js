'use strict';

const express = require('express');
const authRouter = express.Router();

const User = require('./models/users.js');
const basicAuth = require('./middleware/basic.js')
const bearerAuth = require('./middleware/bearer.js')

authRouter.post('/signup', async (req, res, next) => {
  try {
    console.log("request is: " + req);
    console.log("body is: " + req.body);
    let user = new User(req.body);
    console.log("user object is: " + user);
    const userRecord = await user.save();
    console.log("user record: " + userRecord);
    const output = {
      user: userRecord,
      token: userRecord.token
    };
    console.log("output object: " + output);
    res.status(200).json(output);
  } catch (e) {
    next(e.message)
  }
});

authRouter.post('/signin', basicAuth, (req, res, next) => {
  const user = {
    user: request.user,
    token: request.user.token
  };
  res.status(200).json(user);
});

authRouter.get('/users', bearerAuth, async (req, res, next) => {
  const users = await User.find({});
  const list = users.map(user => user.username);
  res.status(200).json(list);
});

authRouter.get('/secret', bearerAuth, async (req, res, next) => {
  res.status(200).send("Welcome to the secret area!")
});


module.exports = authRouter;
