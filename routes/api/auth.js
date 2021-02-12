import express from 'express';
const authRouter = express.Router();

// @route   GET api/auth
// @desc    Test Route
// @access  Public
authRouter.get('/', (req, res) => res.send('Auth route'));

export default authRouter;
