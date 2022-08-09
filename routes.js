'use strict';

const express = require('express');
const { asyncHandler } = require('./middleware/async-handler');
const { User, Course } = require('./models');
const { authenticateUser } = require('./middleware/auth-user');

// Construct a router instance.
const router = express.Router();

/* User Routes */

// /api/users GET route that will return all properties and values for the currently authenticated User 
// along with a 200 HTTP status code
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;

    res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddress,
        password: user.password,
    });  
}));

// /api/users POST route that will create a new user, set the Location header to "/"
// and return a 201 HTTP status code and no content
router.post('/users', asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);
    //   res.status(201).json({ "message": "Account successfully created!" });
        res.status(201).location('/').end();
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });   
      } else {
        throw error;
      }
    }
  }));

/* Course Routes */

// /api/courses GET route that will return all courses including the User associated with each course
//  and a 200 HTTP status code
router.get('/courses', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
        include: [
        {
            model: User,
            as: 'user',
            attributes: [ 'firstName', 'lastName', 'emailAddress' ]
        }
        ],
    });
        res.status(200).json(courses);
}));