import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getPost } from '../../actions/post';
import Spinner from '../layout/Spinner';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import Moment from 'react-moment';

const Post = ({ match }) => {
  const dispatch = useDispatch();
  const postState = useSelector((state) => ({
    post: state.postReducer.post,
    loading: state.postReducer.loading,
  }));

  const { post, loading } = postState;

  useEffect(() => {
    const postId = match.params.id;

    dispatch(getPost(postId));

    //eslint-disable-next-line
  }, []);

  if (loading || !post) {
    return <Spinner />;
  }

  const { _id, avatar, comments, date, name, text, user } = post;

  return (
    <section className='container'>
      <Link to='/posts' className='btn'>
        Back To Posts
      </Link>
      <div className='post bg-white p-1 my-1'>
        <div>
          <Link to={`/profile/${user}`}>
            <img className='round-img' src={avatar} alt={name} title={name} />
            <h4>{name}</h4>
          </Link>
        </div>
        <div>
          <p className='my-1'>{text}</p>
          <p className='post-date'>
            Posted on <Moment format='DD/MM/YYYY'>{date}</Moment>
          </p>
        </div>
      </div>

      <CommentForm postId={_id} />

      <div className='comments'>
        {comments.length > 0
          ? comments.map((comment) => (
              <CommentItem comment={comment} key={comment._id} postId={_id} />
            ))
          : 'No comment added to this post'}
      </div>
    </section>
  );
};

export default Post;
