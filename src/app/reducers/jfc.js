import { INIT_JFC_SELECT_SUCCESS, INIT_JFC_SELECT_ERROR, UPDATE_CITY_SELECT } from '../constants';

export default (state = {}, action) => {
    const { type, payload } = action;

    switch (type) {
        case INIT_JFC_SELECT_SUCCESS: {
            const { jfc } = payload;
            const { ReferenceLists, CountriesPivot } = jfc;
            const { City } = ReferenceLists;

            return {
                ...state,
                ...ReferenceLists,
                originalCities: [...City],
                CountriesPivot
            };
        }

        case UPDATE_CITY_SELECT: {
            const { cityOption } = payload;
            return {
                ...state,
                City: [...cityOption]
            };
        }

        default:
            return state;
    }
};
