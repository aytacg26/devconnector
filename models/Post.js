import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  text: {
    type: String,
    required: true,
  },
  name: {
    //post name
    type: String,
  },
  avatar: {
    //If user deletes his/her account we will still need avatar on UI
    type: String,
  },
  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
      text: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      avatar: {
        type: String,
      },
      date: {
        //date of comment:
        type: Date,
        default: Date.now(),
      },
      //we can add subcomments array for comments and also for each comment there will be likes array for the comment and each subcomment will also have likes array.
    },
  ],
  date: {
    //date of post
    type: Date,
    default: Date.now(),
  },
});

const Post = mongoose.model('post', PostSchema);

export default Post;
