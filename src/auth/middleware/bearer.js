'use strict';

const users = require('../models/users.js')

module.exports = async (req, res, next) => {

  console.log('headers',req.headers)
  let token = req.headers.authorization.split(' ').pop();
  console.log('token', token)

  users.authenticateWithToken(token)
    .then(validUser => {
      req.user = validUser;
      next();
    })
    .catch(err => next(err.message));
}

//   try {

//     if (!req.headers.authorization) { next('Invalid Login') }

//     const token = req.headers.authorization.split(' ').pop();
//     const validUser = await users.authenticateWithToken(token);

//     req.user = validUser;
//     req.token = validUser.token;

//   } catch (e) {
//     res.status(403).send('Invalid Login');;
//   }
// }
