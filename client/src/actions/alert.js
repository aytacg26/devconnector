import { v4 as uuid } from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

export const setAlert = (msg, alertType, timeout = 5000) => {
  return (dispatch) => {
    const id = uuid();
    console.log('We are dispatching now');
    dispatch({
      type: SET_ALERT,
      payload: { msg, alertType, id },
    });

    const timer = setTimeout(() => {
      dispatch({ type: REMOVE_ALERT, payload: id });
      clearTimeout(timer);
    }, timeout);
  };
};
