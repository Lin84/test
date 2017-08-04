import { UPDATE_USER_DATA, INIT_USER_DATA } from '../constants';

export const initUserData = (userData) => ({
    type: INIT_USER_DATA,
    payload: {
        userData
    }
});

export const updateUserData = ({ name, value }) => ({
    type: UPDATE_USER_DATA,
    payload: {
        name,
        value
    }
});
