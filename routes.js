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

// /api/courses/:id GET route that will return the corresponding course including the User associated with that course
// and a 200 HTTP status code
router.get('/courses/id', asyncHandler(async (req, res) => {
    const course = await Course.findbyPk(req.params.id, {
        include: [
            {
                model: User,
                as: 'user',
                attributes: [ 'firstName', 'lastName', 'emailAddress' ]
            }
            ],
        });
    res.status(200).json(course);
}));

// /api/courses POST route that will create a new course, set the Location header to the URI for the newly created course,
// and return a 201 HTTP status code and no content
router.post('/users', asyncHandler(async (req, res) => {
    try {
      await Course.create(req.body);
    //   res.status(201).json({ "message": "Account successfully created!" });
        res.status(201).location(`/courses/${course.id}`).end();
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });   
      } else {
        throw error;
      }
    }
  }));

  // /api/courses/:id PUT route that will _update_ the corresponding course 
  // and return a 204 HTTP status code and no content
  router.put('/courses/:id', authenticateUser, asyncHandler(async(req, res) => {
    try {
        const user = req.currentUser;
        let course = await Course.findByPk(req.params.id)
      //   res.status(201).json({ "message": "Account successfully created!" });
        //   res.status(201).location(`/courses/${course.id}`).end();
          if(course){
            await course.update(req.body);
            res.status(204).end();
            } else {
            res.sendStatus(403);
        }
      } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
          const errors = error.errors.map(err => err.message);
          res.status(400).json({ errors });   
        } else {
          throw error;
        }
      }
    }));

// router.put('/:id', function(req, res, next){
//     Article.findByPk(req.params.id).then(function(article) {
//         return article.update(req.body);
//     }).then(function(article){
//         res.redirect("/articles/" + article.id);    
//     });
// });

// /api/courses/:id DELETE route that will delete the corresponding course
// and return a 204 HTTP status code and no content
// router.delete("/courses/:id", authenticateUser, asyncHandler(async(req, res) => {
//     const course = await Course.findByPk(req.params.id)

//     // Article.findById(req.params.id).then(function(article){  
//     if(course) {
//         return article.destroy();
//     } else {
//         res.send(404);
//     }
//     }).then(function(){
//       res.redirect("/articles");    
//     }).catch(function(error){
//         res.send(500, error);
//      });
//   }));

module.exports = router;
