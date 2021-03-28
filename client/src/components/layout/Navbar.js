import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../actions/auth';

const Navbar = ({ history }) => {
  const authState = useSelector((state) => ({
    isAuthenticated: state.authReducer.isAuthenticated,
    token: state.authReducer.token, //no need to bring this here
    user: state.authReducer.user,
    loading: state.authReducer.loading,
  }));

  const dispatch = useDispatch();

  const { isAuthenticated, token, user, loading } = authState;

  const handleLogout = () => {
    dispatch(logout());
  };

  const authLinks = (
    <ul>
      <li>
        <Link to='/dashboard' title='Dashboard - Profile'>
          <i className='fas fa-user'></i>{' '}
          <span className='hide-sm'>Dashboard</span>
        </Link>
      </li>
      <li>
        <a onClick={handleLogout} href='#!' title='Logout'>
          <i className='fas fa-sign-out-alt'></i>{' '}
          <span className='hide-sm'>Logout</span>
        </a>
      </li>
    </ul>
  );
  const gusetLinks = (
    <ul>
      <li>
        <Link to='/developers'>Developers</Link>
      </li>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </ul>
  );

  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          <i className='fas fa-code'></i> DevConnector
        </Link>
      </h1>

      {isAuthenticated && !loading ? authLinks : gusetLinks}
    </nav>
  );
};

export default Navbar;
