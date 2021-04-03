import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from '../layout/Spinner';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const authState = useSelector((state) => ({
    isAuthenticated: state.authReducer.isAuthenticated,
    loading: state.authReducer.loading,
  }));
  const { isAuthenticated, loading } = authState;
  const token = localStorage.token;

  if (loading) {
    return <Spinner />;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        !isAuthenticated && !token ? (
          <Redirect to='/login' />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PrivateRoute;
