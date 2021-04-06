import React, { Fragment, useState, useEffect } from 'react';
import Spinner from '../layout/Spinner';
import PropTypes from 'prop-types';

const ProfileTop = ({ profile }) => {
  const { user, company, location, status, social, website } = profile;

  let socialLinks;
  if (social) {
    const { twitter, facebook, linkedin, youtube, instagram } = social;

    socialLinks = (
      <Fragment>
        {twitter && (
          <a href={twitter} target='_blank' rel='noopener noreferrer'>
            <i className='fab fa-twitter fa-2x'></i>
          </a>
        )}
        {facebook && (
          <a href={facebook} target='_blank' rel='noopener noreferrer'>
            <i className='fab fa-facebook fa-2x'></i>
          </a>
        )}
        {linkedin && (
          <a href={linkedin} target='_blank' rel='noopener noreferrer'>
            <i className='fab fa-linkedin fa-2x'></i>
          </a>
        )}
        {youtube && (
          <a href={youtube} target='_blank' rel='noopener noreferrer'>
            <i className='fab fa-youtube fa-2x'></i>
          </a>
        )}
        {instagram && (
          <a href={instagram} target='_blank' rel='noopener noreferrer'>
            <i className='fab fa-instagram fa-2x'></i>
          </a>
        )}
      </Fragment>
    );
  }

  return (
    <div className='profile-top bg-primary p-2'>
      <img
        className='round-img my-1'
        src={user.avatar}
        alt={`${user.name} - ${status}`}
        title={`${user.name} - ${status}`}
      />
      <h1 className='large'>{user.name}</h1>
      <p className='lead'>{company ? `${status} at ${company}` : null}</p>
      <p>{location ? location : null}</p>
      <div className='icons my-1'>
        {website && (
          <a href={website} target='_blank' rel='noopener noreferrer'>
            <i className='fas fa-globe fa-2x'></i>
          </a>
        )}
        {socialLinks}
      </div>
    </div>
  );
};

ProfileTop.propTypes = {
  profile: PropTypes.object.isRequired,
  loading: PropTypes.bool,
};

export default ProfileTop;
