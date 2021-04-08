import React from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { useDispatch, useSelector } from 'react-redux';
import { deleteComment } from '../../actions/post';
import PropTypes from 'prop-types';

const CommentItem = ({
  comment: { _id, text, name, avatar, user, date },
  postId,
}) => {
  const state = useSelector((state) => ({
    authUser: state.authReducer.user,
  }));

  const dispatch = useDispatch();

  const { authUser } = state;

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
        {authUser && authUser._id === user && (
          <button
            type='button'
            className='btn btn-danger'
            onClick={() => dispatch(deleteComment(postId, _id))}
          >
            <i className='fas fa-times'></i>
          </button>
        )}
      </div>
    </div>
  );
};

CommentItem.propTypes = {
  comment: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
};

export default CommentItem;
