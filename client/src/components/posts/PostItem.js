import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { useDispatch, useSelector } from 'react-redux';
import { addLike, deletePost, removeLike } from '../../actions/post';

const PostItem = ({
  post: { _id, text, name, avatar, user, likes, comments, date },
}) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => ({
    auth: state.authReducer,
  }));

  const { auth } = state;

  return (
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
        <button
          type='button'
          className='btn btn-light'
          onClick={() => dispatch(addLike(_id))}
        >
          <i className='fas fa-thumbs-up'></i>{' '}
          {likes.length > 0 && <span>{likes.length}</span>}
        </button>
        <button
          type='button'
          className='btn btn-light'
          onClick={() => dispatch(removeLike(_id))}
        >
          <i className='fas fa-thumbs-down'></i>
        </button>
        <Link to={`/post/${_id}`} className='btn btn-primary'>
          Discussion
          {comments.length > 0 && (
            <span className='comment-count'>{comments.length}</span>
          )}
        </Link>
        {!auth.loading && user === auth.user._id && (
          <button
            type='button'
            className='btn btn-danger'
            onClick={() => dispatch(deletePost(_id))}
          >
            <i className='fas fa-times'></i>
          </button>
        )}
      </div>
    </div>
  );
};

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
};

export default PostItem;
