import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts } from '../../actions/post';
import PostItem from './PostItem';
import PostForm from './PostForm';
import Spinner from '../layout/Spinner';

const Posts = () => {
  const dispatch = useDispatch();
  const postsState = useSelector((state) => ({
    posts: state.postReducer.posts,
    loading: state.postReducer.loading,
  }));

  const { posts, loading } = postsState;

  useEffect(() => {
    dispatch(getPosts());

    //eslint-disable-next-line
  }, []);

  if (loading || !posts) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <h1 className='large text-primary'>Posts</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Welcome to the community
      </p>
      <PostForm />
      {posts.map((post) => (
        <PostItem key={post._id} post={post} />
      ))}
    </Fragment>
  );
};

export default Posts;
