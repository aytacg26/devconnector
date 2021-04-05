import React, { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteAccount, getCurrentProfile } from '../../actions/profile';
import Spinner from '../layout/Spinner';
import DashboardActions from './DashboardActions';
import Education from './Education';
import Experience from './Experience';

const Dashboard = () => {
  const dispatch = useDispatch();
  const profileState = useSelector((state) => ({
    profile: state.profileReducer.profile,
    loading: state.profileReducer.loading,
    error: state.profileReducer.error,
    repos: state.profileReducer.repos,
    isAuthenticated: state.authReducer.isAuthenticated, //in fact, this is not required, because PrivateRoute will check authenticated user
    user: state.authReducer.user,
  }));

  const {
    profile,
    loading,
    error,
    repos,
    isAuthenticated,
    user,
  } = profileState;

  useEffect(() => {
    dispatch(getCurrentProfile());
  }, []);

  return (
    <div>
      {loading && profile === null ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className='large text-primary'>Dashboard</h1>
          <p className='lead'>
            <i className='fas fa-user'></i> Welcome {user && user.name}
          </p>
          {profile !== null ? (
            <Fragment>
              <DashboardActions />
              <Education education={profile.education} />
              <Experience experience={profile.experience} />
              <div className='my-2'>
                <button
                  className='btn btn-danger'
                  onClick={() => dispatch(deleteAccount())}
                >
                  <i className='fas fa-user-minus'></i>
                  {'  '}
                  Delete My Account
                </button>
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <p>You have not yet setup a profile, please add some info</p>
              <Link to='/create-profile' className='btn btn-primary my-1'>
                Create Profile
              </Link>
            </Fragment>
          )}
        </Fragment>
      )}
    </div>
  );
};

export default Dashboard;
