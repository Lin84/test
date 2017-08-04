import { UPDATE_USER_DATA, INIT_USER_DATA } from '../constants';

export default (state = {}, action) => {
    const { type, payload } = action;

    switch (type) {
        case INIT_USER_DATA: {
            const { userData } = payload;
            return {
                ...state,
                ...userData
            };
        }

        case UPDATE_USER_DATA: {
            const { name, value } = payload;
            return {
                ...state,
                [name]: value
            };
        }

        default:
            return state;
    }
};
