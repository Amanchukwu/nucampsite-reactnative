//This module imports all the action types then it exports the campsites reducer which takes the campsite section of the state and initializes it with the default funcitno parameter syntax if it has not already been initinalized. Then it takes the action that was dispacted to it and depending on what that action is, it creates and returns a new state, or if none of the actions matched, then it just returns the previous state without doing anything to it. All reducer files work in this same way.
import * as ActionTypes from './ActionTypes';

export const campsites = (state = { isLoading: true,
                                     errMess: null,
                                     campsites: []}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_CAMPSITES:
            return {...state, isLoading: false, errMess: null, campsites: action.payload};

        case ActionTypes.CAMPSITES_LOADING:
            return {...state, isLoading: true, errMess: null, campsites: []}

        case ActionTypes.CAMPSITES_FAILED:
            return {...state, isLoading: false, errMess: action.payload};

        default:
            return state;
      }
};