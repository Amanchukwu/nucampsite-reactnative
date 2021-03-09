//
import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk'; //Middleware library
import logger from 'redux-logger'; //Middleware library
import { campsites } from './campsites';
import { comments } from './comments';
import { promotions } from './promotions';
import { partners } from './partners';

//This function returns the result of calling the redux function "createStore" with a "combineReducers" argument that combines all the reducers into a single root reducer. Along with a call to applyMiddleware to enable redux-thunk and redux-loger to work
export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            campsites,
            comments,
            partners,
            promotions
        }),
        applyMiddleware(thunk, logger)
    );

    return store;
}