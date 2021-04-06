import React from 'react';
import Moment from 'react-moment';

const ProfileEducation = ({
  education: { school, fieldofstudy, degree, from, to, current, description },
}) => {
  return (
    <div>
      <h3>{school}</h3>
      <p>
        <Moment format='MMM YYYY'>{from}</Moment> -{' '}
        {current ? 'Current' : <Moment format='MMM YYYY'>{to}</Moment>}
      </p>
      <p>
        <strong>Degree: </strong>
        {degree}
      </p>
      <p>
        <strong>Field Of Study: </strong>
        {fieldofstudy}
      </p>
      <p>
        <strong>Description: </strong>
        {description}
      </p>
    </div>
  );
};

export default ProfileEducation;
