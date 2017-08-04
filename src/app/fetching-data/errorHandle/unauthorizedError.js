import axios from 'axios';

const unauthorizedRedirect = () => {
    if (!stcLoginData || !stcLoginData.CoremediaLogoutApiEndpoint || !stcLoginData.SitecoreLoginUrl) return;

    setTimeout(() => {
        axios(stcLoginData.CoremediaLogoutApiEndpoint, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        })
        .then(response => {
            window.location = stcLoginData.SitecoreLoginUrl;
        })
        .catch(error => {
            window.location = stcLoginData.SitecoreLoginUrl;
        });
    }, 3000);
};

export {
    unauthorizedRedirect
};
