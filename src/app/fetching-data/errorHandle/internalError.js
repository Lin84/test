export default function({ componentBehaviour, errorResponse } = {}) {
    // console.log('500');
    // const tempResponse = {
    //     Message: '500 An error has occurred.',
    //     ExceptionMessage: 'Unexpected status code not Found'
    // };

    switch (componentBehaviour) {
        case 'post': {
            // console.log('specific');
            const messageResponse = errorResponse.response.data.Message || 'ERROR 500 - We are really sorry,';
            const exceptionMessageResponse = errorResponse.response.data.ExceptionMessage || 'please come back later.';
            return `${messageResponse} ${exceptionMessageResponse}`;
        }

        default: {
            // console.log('default');
            const messageResponse = errorResponse.response.data.Message || 'ERROR 500 - We are really sorry,';
            const exceptionMessageResponse = errorResponse.response.data.ExceptionMessage || 'please come back later.';
            return `${messageResponse} ${exceptionMessageResponse}`;
        }
    }
}
