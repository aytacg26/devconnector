import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import { getProfileById } from '../../actions/profile';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';
import GithubRepos from './GithubRepos';

const Profile = ({ match }) => {
  const dispatch = useDispatch();
  const profileState = useSelector((state) => ({
    profile: state.profileReducer.profile,
    user: state.authReducer.user,
    loading: state.profileReducer.loading,
    isAuth: state.authReducer.isAuthenticated,
  }));

  const { user, profile, loading, isAuth } = profileState;
  const id = match.params.id;

  useEffect(() => {
    //We will get Id from link
    dispatch(getProfileById(id));

    //eslint-disable-next-line
  }, [id]);

  if (loading || profile === null) {
    return <Spinner />;
  }

  return (
    <Fragment>
      {!profile ? (
        <p>No profile found</p>
      ) : (
        <Fragment>
          <Link to='/profiles' className='btn btn-light'>
            Back to Profiles
          </Link>
          {isAuth && id === user._id ? (
            <Link to='/edit-profile' className='btn btn-dark'>
              Edit Profile
            </Link>
          ) : null}
        </Fragment>
      )}
      <div className='profile-grid my-1'>
        <ProfileTop profile={profile} />
        <ProfileAbout profile={profile} />
        <div className='profile-exp bg-white pp-2' style={{ padding: '10px' }}>
          <h2 className='text-primary'>Experience</h2>
          {profile.experience.length > 0 ? (
            <ProfileExperience experiences={profile.experience} />
          ) : (
            <h4>No Experience Credentials</h4>
          )}
        </div>
        <div className='profile-edu bg-white p-2'>
          <h2 className='text-primary'>Education</h2>
          {profile.education.length > 0 ? (
            profile.education.map((edu) => (
              <ProfileEducation education={edu} key={edu._id} />
            ))
          ) : (
            <h4>No Education Credentials</h4>
          )}
        </div>
        {profile.githubusername && (
          <GithubRepos githubusername={profile.githubusername} />
        )}
      </div>
    </Fragment>
  );
};

export default Profile;
