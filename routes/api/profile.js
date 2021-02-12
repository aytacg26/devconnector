import express from 'express';
const profileRouter = express.Router();

// @route   GET api/users
// @desc    Test Route
// @access  Public
profileRouter.get('/', (req, res) => res.send('Profile route'));

export default profileRouter;
