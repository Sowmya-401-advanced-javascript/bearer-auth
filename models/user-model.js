'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = 'secretstuff';


const usersSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
}, { toJSON: {virtuals: true}});

usersSchema.virtual('token').get(function () {
    // I can put whatever I want in this object. It is going to be the value of the token key
    let tokenObject = {
      username:this.username,
    }
  
    // jwt.sign is going to encode the token
    // we want to encode with a secret so that we know it is legit
    return jwt.sign(tokenObject, SECRET);
})

usersSchema.pre('save', async function() {
  // checks to see if the password has changed
  if(this.isModified('password')){
    this.password = await bcrypt.hash(this.password, 10);
  }
})

// this method will only run on teh model itself NOT the object instance
// you can User.authenticateBasic vs I cannot do new User().authenticateBasic

usersSchema.statics.authenticateBasic = async function (username, password) {
    console.log('offbasic', username, password);
    const user = await this.findOne({ username });
    await console.log('user', user);
    const valid = await bcrypt.compare(password, user.password);
    console.log('valid', valid);
    if (valid) { return user; }
    throw new Error('Invalid User');
}

usersSchema.statics.authenticateWithToken = async function (token) {
    // verify if that token is real
    try {
      const parsedToken = jwt.verify(token, SECRET);
      const user = this.findOne({ username: parsedToken.username });
      if(user) { return user; }
      throw new Error('user not found');
    } catch (e) {
      throw new Error (e.message);
    }
    // if it is, send back the user object
    // if not, send an error
}

module.exports = mongoose.model('users', usersSchema);