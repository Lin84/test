import { UPDATE_DATA, EMPTY_DATA_FIELD } from '../constants';

export default (state = {}, action) => {
    const { type, payload } = action;

    switch (type) {
        case UPDATE_DATA: {
            const { name, value } = payload;
            return {
                ...state,
                [name]: value
            };
        }

        case EMPTY_DATA_FIELD: {
            const { name } = payload;
            return {
                ...state,
                [name]: ''
            };
        }

        default: {
            return state;
        }
    }
};
