import { GET_PROFILE, PROFILE_ERROR } from './types';
import { setAlert } from './alert';
import axios from 'axios';

//GET THE CURRENT USER PROFILE
export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/profile/me');

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

//Create or Update Profile
export const createProfile = (formData, history, edit = false) => async (
  dispatch
) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.post('/api/profile', formData, config);

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });

    const message = edit
      ? 'Changes saved and Profile Updated'
      : 'Profile Created Successfully';

    dispatch(setAlert(message, 'success'));

    if (!edit) {
      history.push('/dashboard');
    }
  } catch (error) {
    //For validation errors :
    const errors = error.response.data.errors;
    console.log(error.response.data.errors);

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger', 6000)));
    }

    //For creation or update errors
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};
