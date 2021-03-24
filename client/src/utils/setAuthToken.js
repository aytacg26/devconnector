import axios from 'axios';

const setAuthToken = (token) => {
  if (token) {
    //this will put x-auth-token to global header
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;
