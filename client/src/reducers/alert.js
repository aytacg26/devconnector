import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

const initialState = [];

//action will contain two things
//1- Mandatory thing => type
//2- payload => which will contain any data (Sometimes this can be empty, no data)
const alertReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT:
      return [...state, payload];
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload); //in here payload is going to be an id, payload can be whatever we want
    default:
      return state;
  }
};

export default alertReducer;
