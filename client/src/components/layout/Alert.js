import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const Alert = () => {
  //We get the initialState of alertReducer by using useSelector. To reach actions of a reducer to dipatch them, we need to use useDispatch from react-redux
  const alerts = useSelector((state) => state.alertReducer);
  let alert = null;
  if (alerts !== null && alerts.length > 0) {
    alert = alerts.map((al) => (
      <div key={al.id} className={`alert alert-${al.alertType}`}>
        {al.msg}
      </div>
    ));
  }

  return alert;
};

export default Alert;
