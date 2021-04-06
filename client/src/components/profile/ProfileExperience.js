import React, { Fragment } from 'react';
import ExperienceItem from './ExperienceItem';

const ProfileExperience = ({ experiences }) => (
  <Fragment>
    {experiences.map((experience) => (
      <ExperienceItem experience={experience} key={experience._id} />
    ))}
  </Fragment>
);

export default ProfileExperience;
