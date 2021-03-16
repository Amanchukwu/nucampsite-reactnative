import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk'; //Middleware library
import logger from 'redux-logger'; //Middleware library
import { campsites } from './campsites';
import { comments } from './comments';
import { promotions } from './promotions';
import { partners } from './partners';
import { favorites } from './favorites';
import { persistStore, persistCombineReducers } from 'redux-persist'; //Added for redux persist. Add persistent support for reducers.
import storage from 'redux-persist/es/storage'; //Added for redux persist. Gives access to local storage on device and adds storage support

const config = { //Needed for "persist", first 2 properties are required
    key: 'root', 
    storage, //this property is for storage, we are putting in the "storage" that we imported above. There are other types of storage depending on use case.
    debug: true //THis causes redux-persist to console log messages that will help with debugging.
}

//This function returns the result of calling the redux function "createStore" with a "combineReducers" argument that combines all the reducers into a single root reducer. Along with a call to applyMiddleware to enable redux-thunk and redux-loger to work
export const ConfigureStore = () => {
    const store = createStore(
        persistCombineReducers(config, { //Changed from "combineReducers" and pass "config" object from above for first argument. Now "persistCombineReducers" function will handle updating the state to local storage whenever a reducer is used to update the redux store
            campsites,
            comments,
            partners,
            promotions,
            favorites
        }),
        applyMiddleware(thunk, logger)
    );

    const persistor = persistStore(store); //"persistor" variable is set up by calling built in function "persistStore" passing "store" as an argument. THis enables the store to be persisted and we'll need to use this variable later in App.js.

    return { persistor, store }; //return an object that contains both the "persistor" and the "store" so we can access both from App.js
};