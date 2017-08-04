import axios from 'axios';
import { INIT_JFC_SELECT, INIT_JFC_SELECT_SUCCESS, HANDLE_ERROR_GET_REQUEST, UPDATE_CITY_SELECT, EMPTY_DATA_FIELD } from '../constants';
import { removeLoadingCircle } from '../loadingCircle';
import errorHandler from '../../app/fetching-data/errorHandle/errorHandler';

export const initJfc = ({ noConnectionErrorMessage }) => {
    return (dispatch) => {
        dispatch({
            type: INIT_JFC_SELECT
        });

        defaultHeaders['Content-Type'] = 'application/json; charset=utf-8';
        axios(components.jfc01.ApiGetFiltersEndpoint, {
            method: 'GET',
            headers: defaultHeaders
        }).then(response => {
            dispatch({
                type: INIT_JFC_SELECT_SUCCESS,
                payload: {
                    jfc: response.data
                }
            });

        }).catch(error => {
            const errorResult = errorHandler({ errorResponse: error, noConnectionErrorMessage });

            dispatch({
                type: HANDLE_ERROR_GET_REQUEST,
                payload: {
                    error: errorResult
                }
            });
        });
    };
};

export const updateCitySelect = ({ country, countriesPivot, city }) => {
    return (dispatch) => {

        let cityOption;
        if (country.length > 0) {
            cityOption = countriesPivot[country];
        } else {
            cityOption = [...city];
            dispatch({
                type: UPDATE_CITY_SELECT,
                payload: {
                    cityOption
                }
            });
        }

        dispatch({
            type: UPDATE_CITY_SELECT,
            payload: {
                cityOption
            }
        });
    };
};
