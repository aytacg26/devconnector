import express from 'express';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { check, validationResult } from 'express-validator';
import { completedMessage, errorMessage } from '../../messages/messages.js';
import User from '../../models/User.js';
import UserProfile from '../../models/Profile.js';
import Post from '../../models/Post.js';

const postsRouter = express.Router();

/**
 * @route           POST api/posts
 * @description     Create a new post
 * @access          Private
 *
 *                  User must be authenticated to send a post
 */
postsRouter.post(
  '/',
  [authMiddleware, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      return errorMessage(res, 400, errors.array());
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();
      res.json(post);
    } catch (error) {
      console.error('Server Error', error.message);
      errorMessage(res);
    }
  }
);

/**
 * @route           GET api/posts
 * @description     Get all posts
 * @access          Private
 *
 *                  Any User must be authenticated to see the posts.
 */

postsRouter.get('/', authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });

    res.json(posts);
  } catch (error) {
    console.error('Server Error');
    errorMessage(res);
  }
});

/**
 * @route           GET api/posts/:id
 * @description     Get a post by post id
 * @access          Private
 *
 *                  Any User must be authenticated to see the posts.
 */

postsRouter.get('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return errorMessage(res, 404, "Couldn't find the post");
    }

    res.json(post);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return errorMessage(res, 404, "Couldn't find the post");
    }

    console.error('Server Error');
    errorMessage(res);
  }
});

/**
 * @route           DELETE api/posts/:id
 * @description     Delete a post by post id
 * @access          Private
 *
 *                  Any User must be authenticated to delete the post and also post must be belongs to that user.
 */

postsRouter.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return errorMessage(res, 404, "Couldn't find the post");
    }

    //Check user if the post is owned by the user!!!
    if (post.user.toString() !== req.user.id) {
      return errorMessage(res, 401, 'User not authorized to delete the post');
    }

    await post.remove();
    completedMessage(res, 200, 'Post Deleted Successfully...');
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return errorMessage(res, 404, "Couldn't find the post");
    }

    console.error(error.message);
    errorMessage(res);
  }
});

/**
 * @route           PUT api/posts/like/:id
 * @description     Like a post by post id
 * @access          Private
 *
 *                  Any User must be authenticated to Like a post.
 */

postsRouter.put('/like/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return errorMessage(res, 404, "Couldn't find the post");
    }

    const isLikedByCurrentUser =
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0;

    if (isLikedByCurrentUser) {
      //In here, we must remove user from the likes array instead of creating an unlike PUT request but for this project we will have a seperate Unlike API
      return errorMessage(res, 400, 'Post already liked');
    }

    if (post.user.toString() === req.user.id) {
      return errorMessage(res, 400, 'User cannot like own post!');
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return errorMessage(res, 404, "Couldn't find the post");
    }

    console.error(error.message);
    errorMessage(res);
  }
});

/**
 * @route           PUT api/posts/unlike/:id
 * @description     Like a post by post id
 * @access          Private
 *
 *                  Any User must be authenticated to Like a post.
 */
postsRouter.put('/unlike/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return errorMessage(res, 404, "Couldn't find the post");
    }

    const isUnlikedByCurrentUser =
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0;

    if (isUnlikedByCurrentUser) {
      //Unlike process can be handled in like process!!
      return errorMessage(res, 400, 'Post has not yet been liked');
    }

    if (post.user.toString() === req.user.id) {
      return errorMessage(res, 400, 'User cannot unlike own post!');
    }

    const newLikesArray = post.likes.filter(
      (like) => like.user.toString() !== req.user.id
    );
    post.likes = newLikesArray;

    await post.save();

    res.json(post.likes);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return errorMessage(res, 404, "Couldn't find the post");
    }

    console.error(error.message);
    errorMessage(res);
  }
});

/**
 * @route           PUT api/posts/comment/:id
 * @description     Comment on a post
 * @access          Private
 *
 */
postsRouter.put(
  '/comment/:id',
  [authMiddleware, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      return errorMessage(res, 400, errors.array());
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      if (!post) {
        return errorMessage(res, 404, "Couldn't find the post");
      }

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newComment);

      await post.save();
      res.json(post.comments);
    } catch (error) {
      if (error.kind === 'ObjectId') {
        return errorMessage(res, 404, "Couldn't find the post");
      }
      console.error('Server Error', error.message);
      errorMessage(res);
    }
  }
);

/**
 * @route           DELETE api/posts/comment/:id/:comment_id
 * @description     Delete a Comment on a post
 * @access          Private
 *
 *  Note : A comment can be deleted only by the user who added it or by the user who submit the post.
 *  Adding subcomments will have similar structure because we will need post and also to which comment a subcomment added
 *  Editing Comment also will have similar route, we will need postId and commentId and also it should be edited by the user who created it
 */
postsRouter.delete(
  '/comment/:id/:comment_id',
  authMiddleware,
  async (req, res) => {
    try {
      //A comment can be deleted by the user who send it or by the user who send the post and get the comment from other user.
      const post = await Post.findById(req.params.id);

      //Pull out the comment
      const comment = post.comments.find(
        (comment) => comment.id === req.params.comment_id
      );

      //Make sure comment exists
      if (!comment) {
        return errorMessage(res, 404, 'Comment does not exists');
      }

      //check user (we will check if the user is the one who send the comment, but also in real project, we must check post user, because post user also can delete any comment under the post!!)
      /**
       * it should be like that : (It means if the user who tries to delete the comment is not the one who send the comment and also is not the one who send the post give unauthorized message)
       * if(comment.user.toString()!==req.user.id && post.user.toString !== req.user.id){
       *    return errorMessage(res, 401, "User not authorized");
       * }
       */
      if (comment.user.toString() !== req.user.id) {
        //this logic is valid if we just give permission to the user who send the comment, but in reality, the post owner should also be able to delete any comment under his/her post
        return errorMessage(res, 401, 'User not authorized');
      }

      const newCommentsArray = post.comments.filter(
        (com) => com.id !== req.params.comment_id
      );
      post.comments = newCommentsArray;

      await post.save();
      res.json(post.comments);
    } catch (error) {
      if (error.kind === 'ObjectId') {
        return errorMessage(res, 404, "Couldn't find the post");
      }
      console.error('Server Error', error.message);
      errorMessage(res);
    }
  }
);

export default postsRouter;
