import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGitHubRepos } from '../../actions/profile';
import PropTypes from 'prop-types';

const GithubRepos = ({ githubusername }) => {
  const dispatch = useDispatch();
  const reposState = useSelector((state) => ({
    repos: state.profileReducer.repos,
  }));

  const { repos } = reposState;
  //api/profile/github/:username

  useEffect(() => {
    dispatch(getGitHubRepos(githubusername));
  }, []);

  return (
    <div className='profile-github'>
      <h2 className='text-primary my-1'>
        <i className='fab fa-github'></i> Github Repos
      </h2>

      {repos.length > 0 ? (
        repos.map((repo) => (
          <div className='repo bg-white p-1 my-1' key={repo.id}>
            <div>
              <h4>
                <a
                  href={repo.html_url}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {repo.name}
                </a>
              </h4>
              <p>{repo.description}</p>
            </div>
            <div>
              <ul>
                <li className='badge badge-primary'>
                  Stars: {repo.stargazers_count}
                </li>
                <li className='badge badge-dark'>
                  Watchers: {repo.watchers_count}
                </li>
                <li className='badge badge-light'>Forks: {repo.forks_count}</li>
              </ul>
            </div>
          </div>
        ))
      ) : (
        <h4>No GitHub Repos</h4>
      )}
    </div>
  );
};

GithubRepos.propTypes = {
  githubusername: PropTypes.string.isRequired,
};

export default GithubRepos;
