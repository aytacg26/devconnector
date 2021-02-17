import express from 'express';
import { check, validationResult } from 'express-validator';
import { errorMessage } from '../../messages/messages.js';
import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import User from '../../models/User.js';
import jwt from 'jsonwebtoken';
import config from 'config';
const usersRouter = express.Router();

/**
 * @route   POST api/users
 * @desc    User Registration, user will be registered by his/her name, email address and a password
 * @access  Public
 */
usersRouter.post(
  '/',
  [
    check('name', 'Name is required').not().notEmpty(),
    check('email', 'Please Include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      //1- See if user exists in DB

      let user = await User.findOne({ email });

      if (user) {
        // return res
        //   .status(400)
        //   .json({ errors: [{ msg: 'User already exists' }] });
        return errorMessage(res, 400, 'User already exits');
      }

      //2- Get users' gravatar

      const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });

      //this does not save user, just creates an instance of user, before saving the user, we need to encrypt the user password by using bcrypt
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      //3- Encrypt Password
      const salt = await bcrypt.genSalt(10); //Asynchronously generates a salt, the defalut value is 10, the more length means more secure but will take more time to generate.
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      //4- Return JWT (JSON Web Token)
      const payload = {
        user: {
          id: user.id,
        },
      };

      //!! expiresIn assigned as 360000 (100 hours) for development, but we need to change it 3600 (1 hour) for production

      jwt.sign(
        payload,
        config.get('jwtSecretToken'),
        { expiresIn: 360000 },
        (error, token) => {
          if (error) {
            throw error;
          }

          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      errorMessage(res);
    }
  }
);

export default usersRouter;
