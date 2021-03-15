//Reducer that handles the action type addFavorite
import * as ActionTypes from './ActionTypes';

export const favorites = (state = [], action) => { //Into the parameter list, pass the state for the favorites and initialize it to an empty array if it doesn't exist yet. Also pass in the action (WHAT IS THE action????).
    switch (action.type) { //Switch statement that checks for the action type
        case ActionTypes.ADD_FAVORITE: //We want to store the IDs of each favorited campsite in the state as an array. Then if the user trys to add a new favorite, we recieve the ID of the campsite that is being added as the payload of the ADD_FAVORITE action.
            if (state.includes(action.payload)) { //Check if the campsite ID already exists in the favorites array. Use the JS array method "includes". "includes" takes a single argument (the action payload) and checks to see if it matches any of the items in the array. If so, it will return the boolean value true, otherwise it will return false.
                return state; //If the ID already is in the array, then just return the previous state since nothing needs to change.
            }
            return state.concat(action.payload);//If the ID doesn't already exist in the array, return a new state with the new favorite campsite's ID concatanted to the end of it. Concat makes a copy of the array that it is acting on, adds a new item to the end of it, then returns that new array without mutating the previous array.
        case ActionTypes.DELETE_FAVORITE: //Have the "favorite" state as an array of "campsiteId"s, then from the "deleteFavorite" action we have a "payload" which consists of the "campsitId" that we want to delete from the array.
            return state.filter(favorite => favorite !== action.payload); // Use the ".filter" method on the "favorite" array create a new array from the "favorite" state by filtering into it every campsite that does not match the campsiteId in the "actionPayload". This creates a new array that no longer contains the campsiteId that we are deleting, and return that as the new "state".

        default:
            return state;
    }
};