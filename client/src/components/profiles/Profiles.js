import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfiles } from '../../actions/profile';
import ProfileItem from './ProfileItem';
import Spinner from '../layout/Spinner';

const Profiles = () => {
  const dispatch = useDispatch();
  const profileState = useSelector((state) => ({
    profiles: state.profileReducer.profiles,
    loading: state.profileReducer.loading,
  }));

  const { profiles, loading } = profileState;

  useEffect(() => {
    dispatch(getProfiles());
  }, [getProfiles]);

  let profileList = '';

  if (loading && profiles.length === 0) {
    profileList = <Spinner />;
  } else {
    profileList =
      profiles.length === 0 ? (
        <h4>No Profiles Found</h4>
      ) : (
        profiles.map((profile) => (
          <ProfileItem key={profile._id} profile={profile} />
        ))
      );
  }

  return (
    <Fragment>
      <h1 className='large text-primary'>Developers</h1>
      <p className='lead'>
        <i className='fab fa-connectdevelop'></i> Browse and connect with
        developers
      </p>
      <div className='profiles'>{profileList}</div>
    </Fragment>
  );
};

export default Profiles;
