// https://github.com/acdlite/flux-standard-action

import { UPDATE_DATA, EMPTY_DATA_FIELD } from '../constants';

export const updateData = ({ name, value }) => ({
    type: UPDATE_DATA,
    payload: {
        name,
        value
    }
});

export const emptyData = ({ name }) => ({
    type: EMPTY_DATA_FIELD,
    payload: {
        name
    }
});
