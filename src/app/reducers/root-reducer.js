import { combineReducers } from 'redux';
import counter from './counter';
import jfc from './jfc';
import data from './data';
import handleErrorGetRequest from './handleErrorGetRequest';
import userData from './userData';

const rootReducer = combineReducers({
    counter,
    jfc,
    handleErrorGetRequest,
    data,
    userData
});

export default rootReducer;
