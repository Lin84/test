import badRequest from './badRequest';
import { unauthorizedRedirect } from './unauthorizedError';
import internalError from './internalError';

export default function({ componentBehaviour, errorResponse, noConnectionErrorMessage } = {}) {
    let errorMsg = {};

    switch (errorResponse.response.status) {
        case 500: {
            errorMsg = {
                genericErrorMsg: internalError({ errorResponse, componentBehaviour }),
                hideGenericError: false
            };
            break;
        }

        case 400: {
            const errorMessage = badRequest({ errorResponse, componentBehaviour });

            if (typeof (errorMessage) === 'object') {
                errorMsg = {
                    errorData: errorMessage,
                    displayValidationMsg: true
                };
            } else {
                errorMsg = {
                    genericErrorMsg: errorMessage,
                    hideGenericError: false
                };
            }
            break;
        }

        case 404: {
            errorMsg = {
                genericErrorMsg: noConnectionErrorMessage || 'ERROR 404 - no connection to service.',
                hideGenericError: false
            };
            break;
        }

        case 401: {
            errorMsg = {
                genericErrorMsg: stcLoginData.UnauthorizedMessage || 'ERROR 401',
                hideGenericError: false
            };
            unauthorizedRedirect();
            break;
        }

        default: {
            errorMsg = {
                genericErrorMsg: errorResponse.response.data.Message || 'ERROR - We are really sorry, please try later.',
                hideGenericError: false
            };
        }
    }

    return errorMsg;
}
