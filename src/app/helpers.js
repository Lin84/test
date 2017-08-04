function getErrorMessage(field, key, message = 'Please fill in the field.') {
    if (!field) return null;
    if (field.indexOf(key) === -1) return null;

    return message;
}

function hasClass(elem, klass) {
    return (` ${elem.className} `).indexOf(` ${klass} `) > -1;
}
// TO REMOVE after addapt to all form with new version:
function civilizeFormDefinition(formDefinition) {
    const listOfComponents = {};
    if (formDefinition) {
        listOfComponents.ApiGetEndpoint = formDefinition.ApiGetEndpoint || null;
        listOfComponents.ApiUpdateEndpoint = formDefinition.ApiUpdateEndpoint || null;
        listOfComponents.FormDescription = formDefinition.FormDescription || null;
        listOfComponents.FormIdentity = formDefinition.FormIdentity || null;
        listOfComponents.NoConnectionErrorMessage = formDefinition.NoConnectionErrorMessage || null;
        listOfComponents.SuccessMessage = formDefinition.SuccessMessage || null;

        const listOfChild = formDefinition.Children;
        for (let i = 0; i < listOfChild.length; i += 1) {
            listOfComponents[listOfChild[i].FieldName] = listOfChild[i];
        }
        return listOfComponents;
    }
    return listOfComponents;
}

function civilizeFDefinition(formDefinition) {
    if (!formDefinition) return null;
    const definition = {};

    Object.keys(formDefinition).map((key) => {
        if (key !== 'Children') {
            definition[key] = formDefinition[key];
        }
        return definition;
    });

    return definition;
}

function civilizeComponentsDefinition(formDefinition) {
    if (!formDefinition) return null;
    const listOfComponents = {};

    const listOfChild = formDefinition.Children;
    for (let i = 0; i < listOfChild.length; i += 1) {
        listOfComponents[listOfChild[i].FieldName] = listOfChild[i];
    }

    return listOfComponents;
}

function customEnableEditButton() {
    const allEditBtns = document.querySelectorAll('.formEdit__edit');
    const allEditBtnsLength = allEditBtns.length;
    for (let i = 0; i < allEditBtnsLength; i += 1) {
        const currentBtn = allEditBtns[i];
        currentBtn.removeAttribute('data-actived');
        currentBtn.removeAttribute('disabled');
        currentBtn.classList.remove('disabled');
    }
}

function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    // name = name.replace(/[\[\]]/g, '\\$&');
    // remove '['
    name = name.replace(/\[\]]/g, '\\$&');
    // const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    // var expires = 'expires='+ d.toUTCString();
    const expires = `expires=${d.toUTCString()}`;
    // document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
    document.cookie = `${cname}=${cvalue};${expires};path=/`;
}

function getCookie(cname) {
    // let name = cname + "=";
    const name = `${cname}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    let c;
    for (let i = 0; i < ca.length; i += 1) {
        c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}

function iebContentHeight(form) {
    // bug: 2886 = fix static height of IEB01 content div
    const correctHeight = form.offsetHeight;
    const iebItemContent = getParentsUntil(form, 'ieb-item__content');
    iebItemContent ? iebItemContent.style.height = 'auto' : null;
}

function getParentsUntil (elem, parent) {
    // Element.matches() polyfill
    if (!Element.prototype.matches) {
        Element.prototype.matches =
            Element.prototype.matchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector ||
            Element.prototype.oMatchesSelector ||
            Element.prototype.webkitMatchesSelector ||
            function temporary(s) {
                const matches = (this.document || this.ownerDocument).querySelectorAll(s);
                const i = matches.length;
                // while (--i >= 0 && matches.item(i) !== this) {}
                return i > -1;
            };
    }

    for (; elem && elem !== document; elem = elem.parentNode) {

        if (parent) {
            if (elem.matches(parent)) break;
        }

        if (hasClass(elem, parent)) {
            return elem;
        }
    }
    return null;
}

function getToday() {
    const d = new Date();
    const today = d.getDate();
    const month = d.getMonth();
    const year = d.getYear() + 1900;
    return [year, month, today];
}

function convertDate(date, toDateFormat) {
    if (toDateFormat && date.length > 0) {
        return `${date.slice(6, 8)}.${date.slice(4, 6)}.${date.slice(0, 4)}`;
    }
    return null;
}

function numberWithDot(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function isFunction(functionToCheck) {
    const getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

function displayMathUnit(unit) {
    if (unit.toLowerCase() === 'm3') {
        return 'm<sup>3</sup>';
    } else if (unit.toLowerCase() === 'kwh') {
        return 'kWh';
    }
    return unit;
}

function initSensoryMind(target) {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('message', true, true);
    event.eventName = 'message';
    event.data = JSON.stringify({
        type: 'formReady',
        data: {
            id: target
        }
    });
    window.dispatchEvent(event);
}

function getConfig(id, namespace = 'innogyForm') {
    try {
        if (!window[namespace]) throw new Error(`Missing form configuration: ${namespace}`);
        if (!window[namespace][id]) throw new Error(`Missing form configuration: ${namespace}[${id}]`);

        return window[namespace][id];
    } catch (e) {
        // console.error(e);
    }
    return null;
}

function ScrollToError({ topWindow } = {}) {
    /* eslint-disable */
    require('smoothscroll-polyfill').polyfill();
    /* eslint-disable */

    const customScroll = (topWindow) => {
        if (topWindow) {
            window.scroll({ top: 0, left: 0, behavior: 'smooth' });
            return;
        };
        const errorInput = document.querySelector('.error');
        if (!errorInput) return;

        const docOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        const topOffset = errorInput.getBoundingClientRect().top + docOffset - 100;
        window.scroll({ top: topOffset, left: 0, behavior: 'smooth' });
    }

    setTimeout(customScroll, 200, topWindow);
}

function hideComponent({component, ifHideComponent}) {
    if (!component) return;

    if (ifHideComponent) {
        component.classList.add('hidden');
    }
}

function removeElementsByClass({ className, parentComponent }) {
    if (!parentComponent) return;

    const elements = parentComponent.getElementsByClassName(className);
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

export {
    hasClass,
    civilizeFormDefinition,
    customEnableEditButton,
    getParameterByName,
    setCookie,
    getCookie,
    iebContentHeight,
    getParentsUntil,
    getToday,
    convertDate,
    numberWithDot,
    isFunction,
    displayMathUnit,
    getErrorMessage,
    initSensoryMind,
    getConfig,
    ScrollToError,
    hideComponent,
    removeElementsByClass,
    civilizeComponentsDefinition,
    civilizeFDefinition
};
