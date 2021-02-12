import express from 'express';
const postsRouter = express.Router();

// @route   GET api/posts
// @desc    Test Route
// @access  Public
postsRouter.get('/', (req, res) => res.send('Posts route'));

export default postsRouter;
