import React from 'react';
import Moment from 'react-moment';

const ExperienceItem = ({ experience }) => {
  const { company, from, to, title, description, current } = experience;
  return (
    <div>
      <h3 className='text-dark'>{company}</h3>
      <p>
        <Moment format='MMM YYYY'>{from}</Moment>-{' '}
        {current ? ' Current' : <Moment format='MMM YYYY'>{to}</Moment>}
      </p>
      <p>
        <strong>Position: </strong> {title}
      </p>
      <p>
        <strong>Description: </strong>
        {description}
      </p>
    </div>
  );
};

export default ExperienceItem;
