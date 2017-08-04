// user story: 3662 and 3735

import axios from 'axios';
import { getParentsUntil, removeElementsByClass } from '../../helpers';
import { removeLoadingCircle } from '../loadingCircle';
import internalError from '../../fetching-data/errorHandle/internalError';

function genericErrorDiv(container, errorMessage = 'We are sorry, please try later.') {
    const errorDiv = document.createElement('div');
    const genericErrorBlock = container.querySelector('.validation-summary-errors');

    if (genericErrorBlock) {
        container.removeChild(genericErrorBlock);
    }

    errorDiv.className = 'validation-summary-errors FancyErrorMessage mt-22';
    errorDiv.innerHTML = `<p>${errorMessage}</p>`;
    container.appendChild(errorDiv);
}

function specificFieldError(input, errorMessage = 'We are sorry, please try later.') {
    const errorSpan = document.createElement('span');
    const parrentContainer = getParentsUntil(input, 'form-group');
    const errorBlock = parrentContainer.querySelector('.error-block');

    if (errorBlock) {
        parrentContainer.removeChild(errorBlock);
    }

    errorSpan.className = 'error-block';
    errorSpan.innerHTML = errorMessage;
    parrentContainer.appendChild(errorSpan);
    parrentContainer.classList.add('error');
}

function removeError({ input }) {
    if (!input) return;
    const parrentContainer = getParentsUntil(input, 'form-group');
    const errorBlock = parrentContainer.querySelector('.error-block');

    parrentContainer.classList.remove('error');
    if (!errorBlock) return;
    removeElementsByClass({ className: 'error-block', parentComponent: parrentContainer });
}

export default function() {
    const pioComponent = document.querySelector('[data-tpl="pio01"]');
    const loginForm = pioComponent.querySelector('form');
    const userName = pioComponent.querySelector("[name='UserName']");
    const password = pioComponent.querySelector("[name='Password']");
    const CrossDomainErrorMessage = pioComponent.getAttribute('data-cross-domain-error-message') || 'Cross Domain Error Message';
    const CrossDomainLoginUrl = pioComponent.getAttribute('data-cross-domain-login-url') || 'missing/CrossDomainLoginUrl';
    const CrossDomainLogoutUrl = pioComponent.getAttribute('data-cross-domain-logout-url') || 'missing/CrossDomainLogoutUrl';
    const SitecoreDomainLoginUrl = pioComponent.getAttribute('data-sitecore-login-url') || 'missing/SitecoreDomainLoginUrl';
    const SitecoreDomainLogoutUrl = pioComponent.getAttribute('data-sitecore-logout-url') || 'missing/SitecoreDomainLogoutUrl';
    const CrossDomainLoginDelay = parseInt(pioComponent.getAttribute('data-cross-domain-login-delay') || '1000', 10);
    const submitBtn = pioComponent.querySelector('[type="submit"]');

    let data = {};
    let crossDomainData = {};

    if (userName && password) {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();

            data = {
                UserName: userName.value,
                Password: password.value
            };

            crossDomainData = {
                benutzername: userName.value,
                passwort: password.value
            };

            // I-am-Innogy = sitecore, post request to log in:
            defaultHeaders['Content-Type'] = 'application/json';
            axios(SitecoreDomainLoginUrl, {
                method: 'POST',
                headers: defaultHeaders,
                data: JSON.stringify(data)
            })
            .then(response => {
                // Innogy = coremedia, post request to log in:
                // add cross domain login delay DFD-4159:
                setTimeout(() => {
                    axios(CrossDomainLoginUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        data: JSON.stringify(crossDomainData),
                        withCredentials: true
                    })
                    .then(response => {
                        location.reload();
                    })
                    .catch(error => {
                        // sitecore log out:
                        axios(SitecoreDomainLogoutUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' }
                            // withCredentials: true
                        });

                        // display generic error message after core media log in failed:
                        genericErrorDiv(pioComponent, CrossDomainErrorMessage);
                        removeLoadingCircle();
                    });
                }, CrossDomainLoginDelay);
            })
            .catch(error => {
                // display error message after I am Innogy log in failed:
                switch (error.response.status) {

                    case 400: {
                        /* eslint-disable */
                        // const tempResponse = {"":["Empty key error"]};
                        // debugger;
                        // const data = {
                        //     "Message": "The request is invalid.",
                        //     "ModelState": {
                        //         "userLogin.Username": ["The Username field is required."],
                        //         "userLogin.Password": ["The Password field is required."]
                        //     }
                        // };

                        // const tempResponse = data.ModelState;
                        // const tempResponseKeys = Object.keys(tempResponse);
                        /* eslint-enable */

                        const tempResponse = error.response.data.ModelState;
                        const tempResponseKeys = Object.keys(tempResponse);
                        let tempMessage;

                        if (tempResponseKeys[0] === '') {
                            tempMessage = tempResponse[tempResponseKeys[0]].join(' ') || '400 - empty key - We are really sorry';
                            genericErrorDiv(pioComponent, tempMessage);
                        } else if (tempResponseKeys.length > 0) {
                            if (tempResponse['userLogin.Username']) {
                                specificFieldError(userName, tempResponse['userLogin.Username']);
                            } else {
                                removeError({ input: userName });
                            }
                            if (tempResponse['userLogin.Password']) {
                                specificFieldError(password, tempResponse['userLogin.Password']);
                            } else {
                                removeError({ input: password });
                            }
                        } else {
                            tempMessage = '400 - We are really sorry, please try later sorry';
                            genericErrorDiv(pioComponent, tempMessage);
                        }
                        // removeLoadingCircle();
                        break;
                    }

                    case 500: {
                        genericErrorDiv(pioComponent, internalError({ errorResponse: error }));
                        // removeLoadingCircle();
                        break;
                    }

                    default: {
                        genericErrorDiv(pioComponent, error.response.data.Message);
                        // removeLoadingCircle();
                    }
                }

                removeLoadingCircle();
            });
        });
    } else {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // bug 3163 - put submit in to promise in order to fix the problem with Firefox
            axios(CrossDomainLogoutUrl, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            })
            .then(response => {
                loginForm.submit();
            })
            .catch(error => {
                loginForm.submit();
            });

        });
    }
}
