import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { errorMessage } from '../../messages/messages.js';
import User from '../../models/User.js';
import { check, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import config from 'config';
import bcrypt from 'bcryptjs';
const authRouter = express.Router();

/**
 * @route           GET api/auth
 * @description     Authentication process and token check process (with the help of authMiddleware) will take place here.
 * @access          Public
 */
authRouter.get('/', authMiddleware, async (req, res) => {
  try {
    //req.user.id bize id'yi verecektir. authMiddleware'da payload'u aldığımızda ki jwt user registration'da payload'a sadece user id'yi eklemiştik, authMiddleware buraya req.user'i next ile göndermektedir
    //yine kullanıcı verilerini alırken, password'ü almak istemediğimizden .select("-password") ile tüm data'dan password'ü çıkarıyoruz. Aslında ModelView ile bunu gerçekleştirmemiz gerekecektir.
    const user = await User.findById(req.user.id).select('-password');

    res.json(user); //we did not use status here because default status code is 200 OK
  } catch (error) {
    console.error(error.message);
    errorMessage(res);
  }
});

/**
 * @route           POST api/auth
 * @description     Authenticate user & get token, this will be the login process of user...
 * @access          Public
 */
authRouter.post(
  '/',
  [
    check('email', 'Please Include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      return errorMessage(res, 400, errors.array());
    }

    const { email, password } = req.body;
    try {
      //1- See if user exists in DB

      let user = await User.findOne({ email });

      if (!user) {
        // return res
        //   .status(400)
        //   .json({ errors: [{ msg: 'Invalid Credentials' }] });
        //I created error function to send same structure in all error messages
        return errorMessage(res, 400, 'Invalid Credentials');
      }

      //2- Check if the email and password matches, we will check if the user has correct password with the given email
      //bcrypt will compare the password from request (that is the password entered by user to login) and the password of user which we get from database with User.findOne({email})
      //If both passwords are same, isMacth will return true
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        //Not if user is not exists or entered invalid credentials, in both cases, for security reasons, it is better to give Invalid Credentials message. DO NOT SAY "User is not exists"!!!
        // return res
        //   .status(400)
        //   .json({ errors: [{ msg: 'Invalid Credentials' }] });
        return errorMessage(res, 400, 'Invalid Credentials');
      }

      //3- Return JWT (JSON Web Token)
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

export default authRouter;
