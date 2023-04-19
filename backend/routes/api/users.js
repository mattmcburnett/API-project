const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();


const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Invalid email'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  check('firstName')
    .exists()
    .isString()
    .withMessage("First Name is required"),
  check('lastName')
    .exists()
    .isString()
    .withMessage("Last Name is required"),
  handleValidationErrors
];


//Sign Up A User
router.post(
    '/',
    validateSignup,
    async (req, res) => {
      const { firstName, lastName, email, password, username } = req.body;
      const hashedPassword = bcrypt.hashSync(password);

      //checking email against other users
      const emailCheck = await User.findOne({
        where: {
          email: email
        }
      });
      if(emailCheck) {
        const err = new Error();
        err.message = "User already exists"
        err.errors = { email: "User with that email already exists" }
        return res.status(500).json(err)
      };

      //checking usernames against users
      const usernameCheck = await User.findOne({
        where: {
          username: username
        }
      });
      if(usernameCheck) {
        const err = new Error();
        err.message = "User already exists"
        err.errors = { email: "User with that username already exists" }
        return res.status(500).json(err)
      };

      const user = await User.create({ email, firstName, lastName, username, hashedPassword });

      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };

      await setTokenCookie(res, safeUser);

      return res.json({
        user: safeUser
      });
    }
);







module.exports = router;
