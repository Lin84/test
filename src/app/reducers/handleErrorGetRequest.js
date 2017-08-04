import { HANDLE_ERROR_GET_REQUEST } from '../constants';

export default (state = {}, action) => {
    const { type, payload } = action;

    switch (action.type) {
        case HANDLE_ERROR_GET_REQUEST: {
            const { error } = payload;

            return {
                ...state,
                ...error
            };
        }

        default:
            return state;
    }
};
