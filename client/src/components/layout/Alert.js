import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const Alert = (props) => {
  const alerts = useSelector((state) => state.alert);
  let alert = '';
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
