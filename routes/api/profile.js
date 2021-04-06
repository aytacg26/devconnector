import express from 'express';
import { errorMessage, completedMessage } from '../../messages/messages.js';
import User from '../../models/User.js';
import { check, validationResult } from 'express-validator';
import UserProfile from '../../models/Profile.js';
import Post from '../../models/Post.js';
import request from 'request';
import config from 'config';

import { authMiddleware } from '../../middleware/authMiddleware.js';
const profileRouter = express.Router();

/**
 * @route   GET api/profile/me
 * @desc    Get current users profile, this will be protected for this reason we will need to use authMiddleware
 * @access  Private
 */
profileRouter.get('/me', authMiddleware, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return errorMessage(res, 400, 'There is no profile for this user');
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    errorMessage(res); //default error conatins status 500 and message Server Error
  }
});

/**
 * @route           POST api/profile
 * @description     Create or Update the user profile
 * @access          Private
 */
profileRouter.post(
  '/',
  [
    authMiddleware,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      return errorMessage(res, 400, errors.array());
    }

    //Destruct all data from body by using object destructuring.
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    //Build Profile Object
    const profileFields = {};

    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    if (skills && !Array.isArray(skills)) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    } else {
      profileFields.skills = skills;
    }

    //Build social object :
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      //We are getting the user id from authMiddleware
      let profile = await UserProfile.findOne({ user: req.user.id });

      if (profile) {
        //If there is a profile, that mean there will be an update;
        //UPDATE :

        profile = await UserProfile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      //Create :
      profile = new UserProfile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      errorMessage(res);
    }
  }
);

/**
 * @route           GET api/profile
 * @description     Gets all profiles in database
 * @access          Public
 */

profileRouter.get('/', async (req, res) => {
  try {
    const profiles = await UserProfile.find().populate('user', [
      'name',
      'avatar',
    ]);

    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    errorMessage(res);
  }
});

/**
 * @route           GET api/profile/user/:user_id
 * @description     Get profile by user ID
 * @access          Public
 */

profileRouter.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await UserProfile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return errorMessage(res, 400, 'Profile not found');
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);

    //To prevent any malicious user to test userID's we will check if there is an error because of ObjectId and give same message
    //beacuse if the length of entered ID is not same as the ObjectID length, it will give server error and hence malicious user will
    //understand the structure of userID but with this way, we will prevent the length issue.
    if (error.kind === 'ObjectId') {
      return errorMessage(res, 400, 'Profile not found');
    }

    errorMessage(res);
  }
});

/**
 * @route           DELETE api/profile
 * @description     Delete Profile by User ID
 * @access          Private
 *
 */
profileRouter.delete('/', authMiddleware, async (req, res) => {
  try {
    //Remove user posts (make sure to delete posts first, then profile and at the end accout (User))
    await Post.deleteMany({ user: req.user.id });
    //This will remove profile
    await UserProfile.findOneAndRemove({ user: req.user.id });

    //This will remove user
    await User.findOneAndRemove({ _id: req.user.id });

    completedMessage(res, 200, 'User Deleted.');
  } catch (error) {
    console.error(error.message);
    errorMessage(res);
  }
});

/**
 * @route           PUT api/profile/experience
 * @description     Add Experience(s) to user profile
 * @access          Private
 *
 *  Title, Company, From Date are all going to be required therefore we will also need to validate them in backend, for this reason
 *  we will use express-validator check middlewares in the API.
 */
profileRouter.put(
  '/experience',
  [
    authMiddleware,
    [
      check('title', 'title is required').not().isEmpty(),
      check('company', 'company is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //Now we will apply destructuring to get data from request body :
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;

    //To add data to database as it should be, we will create a new object which will contain all data about newly added experience
    const newExperience = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await UserProfile.findOne({ user: req.user.id });

      //Experiences stored in an array, we can use push but push adds the experience to the end,
      //instead we used unshift to add most recent experience to the beginning of the array. Experiences should be
      //listed from most recent to the last according to the From Dates.
      profile.experience.unshift(newExperience);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      errorMessage(res);
    }
  }
);

/**
 * @route           DELETE api/profile/experience/:exp_id
 * @description     Delete Experience(s) from user profile
 * @access          Private
 *
 * This API will delete an experience from user profile according to experience Id,
 * to do so, we need to get profile by user ID.
 */

profileRouter.delete(
  '/experience/:exp_id',
  authMiddleware,
  async (req, res) => {
    try {
      const profile = await UserProfile.findOne({ user: req.user.id });

      //Get the remove Index: I.WAY :
      // const removeIndex = profile.experience
      //   .map((item) => item.id)
      //   .indexOf(req.params.exp_id);

      // profile.experience.splice(removeIndex, 1);

      //Filter Method : II.Way :
      const newExperiences = profile.experience.filter(
        (item) => item.id !== req.params.exp_id
      );
      profile.experience = newExperiences;

      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error('Server Error');
      errorMessage(res);
    }
  }
);

/**
 * @route           PUT api/profile/education
 * @description     Add Education(s) to user profile
 * @access          Private
 *
 *  When we look at the profile education array, we know that school, degree, fieldOfStudy and from fields are required
 *  for this reason, we will need to use express-validator. Plus, the auth user will be able to add education and therefore
 *  we will need to use authMiddleware. From authMiddleware we will get user ID with the help of token and by using this ID
 *  we will reach profile of the user
 *
 */
profileRouter.put(
  '/education',
  [
    authMiddleware,
    [
      check('school', 'School is required').not().isEmpty(),
      check('degree', 'Degree is required').not().isEmpty(),
      check('fieldofstudy', 'Field of study is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      return errorMessage(res, 400, errors.array());
    }

    //Now we will apply destructuring to get data from request body :
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;

    //To add data to database as it should be, we will create a new object which will contain all data about newly added experience
    const newEducation = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await UserProfile.findOne({ user: req.user.id });

      //Experiences stored in an array, we can use push but push adds the experience to the end,
      //instead we used unshift to add most recent experience to the beginning of the array. Experiences should be
      //listed from most recent to the last according to the From Dates.
      profile.education.unshift(newEducation);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      errorMessage(res);
    }
  }
);

/**
 * @route           DELETE api/profile/education/:edu_id
 * @description     Delete Education(s) from user profile
 * @access          Private
 *
 * This API will delete an education from user profile according to education Id,
 * to do so, we need to get profile by user ID.
 */

profileRouter.delete('/education/:edu_id', authMiddleware, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ user: req.user.id });

    //Get the remove Index: I.WAY :
    // const removeIndex = profile.experience
    //   .map((item) => item.id)
    //   .indexOf(req.params.exp_id);

    // profile.experience.splice(removeIndex, 1);

    //Filter Method : II.Way :
    const newEducations = profile.education.filter(
      (item) => item.id !== req.params.edu_id
    );
    profile.education = newEducations;

    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error('Server Error : ', error);
    errorMessage(res);
  }
});

/**
 * @route           GET api/profile/github/:username
 * @description     Get user repos from github
 * @access          Public
 *
 *                  With the github username of the user, we will get repos of the user from github and will present
 *                  repos on her/his profile
 */
profileRouter.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClientId'
      )}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };
    request(options, (error, response, body) => {
      if (error) {
        console.error(error);
      }

      if (response.statusCode !== 200) {
        return errorMessage(res, 404, 'No Github profile found');
      }

      //The body from github will be regular string with escape quotes and therefore we need to parse it to JSON
      res.json(JSON.parse(body));
    });
  } catch (error) {
    console.error(error.message);
    errorMessage(res);
  }
});

export default profileRouter;
