export default function({ componentBehaviour, errorResponse } = {}) {
    // console.log('400');

    // const tempResponse = {
    //     '': ['400 - Empty key error', 'Yes, I know']
    // };

    // const tempResponse = {
    //     City: ['wrong city'],
    //     Address1: ['please provide the correct street']
    // };

    // const tempResponse = {
    //     OrgName1: ['wrong OrgName1'],
    //     OrgName2: ['wrong OrgName2']
    // };

    const tempResponse = errorResponse.response.data.ModelState;
    const tempResponseKeys = Object.keys(tempResponse);
    let tempMessage;

    switch (componentBehaviour) {
        case 'post': {
            // console.log('specific post');
            if (tempResponseKeys[0] === '') {
                tempMessage = tempResponse[tempResponseKeys[0]].join(' ') || 'ERROR 400 - empty key - We are really sorry';
            } else {
                tempMessage = {};
                tempResponseKeys.map((key) => tempMessage[key] = tempResponse[key].join(' ') || 'ERROR 400 - We are sorry, please try later');
            }
            return tempMessage;
        }

        default: {
            // console.log('default');
            if (tempResponseKeys[0] === '') {
                tempMessage = tempResponse[tempResponseKeys[0]].join(' ') || 'ERROR 400 - empty key - We are really sorry';
            } else if (tempResponseKeys.length > 1) {
                tempMessage = tempResponseKeys.map((key) => tempResponse[key].join(' ')).join(' ') || 'ERROR 400 - We are really sorry';
            } else {
                tempMessage = tempResponse.join(' ') || 'ERROR 400 - We are really sorry';
            }
            return tempMessage;
        }
    }
}
