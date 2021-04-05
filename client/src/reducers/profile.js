import {
  CLEAR_PROFILE,
  GET_PROFILE,
  GET_PROFILES,
  GET_REPOS,
  PROFILE_ERROR,
  UPDATE_PROFILE,
} from '../actions/types';

const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {},
};

const profileReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
    case UPDATE_PROFILE:
      return {
        ...state,
        loading: false,
        error: {},
        profile: payload,
      };

    case GET_PROFILES:
      return {
        ...state,
        loading: false,
        error: false,
        profiles: payload,
      };

    case GET_REPOS:
      return {
        ...state,
        loading: false,
        error: false,
        repos: payload,
      };

    case CLEAR_PROFILE:
      return {
        ...state,
        loading: true,
        profile: null,
        profiles: [],
        repos: [],
        error: {},
      };

    case PROFILE_ERROR:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    default:
      return state;
  }
};

export default profileReducer;
