import { getCookie, setCookie } from './../helpers';

export default function pfcConsuptionCookie(form) {
    const type = form.dataset.productType;
    const template = form.dataset.tpl;
    const products = form.querySelectorAll('.product');
    let productData = getJsonCookie('innogy_pd');
    let consumption = getJsonCookie('innogy_consumption');

    products.forEach((product) => {
        const input = product.querySelector('.pf-input-rate');
        const button = form.querySelector(`.submit-${input.id}`);
        const key = `${type}_${input.id}`;

        if (template === 'pfc02') {
            button.onclick = (e) => {
                e.preventDefault();
            };
        }

        input.addEventListener('keyup', (e) => {
            handleInputChange(input, button, key);
        });

        if (Object.keys(consumption).indexOf(key) > -1) {
            input.value = consumption[key];
        }
    }, this);

    function handleInputChange(input, button, key) {
        const value = input.value;

        if (value.length > 0) {
            productData = getJsonCookie('innogy_pd');
            consumption = getJsonCookie('innogy_consumption');

            if (Number(value) > 0) {
                consumption[key] = Number(value);
            } else {
                delete consumption[key];
            }

            delete productData[key];

            setJsonCookie('innogy_consumption');
            setJsonCookie('innogy_pd');

            if (template === 'pfc02') {
                button.onclick = (e) => {
                    e.preventDefault();

                    location.reload();
                };

                if (button.classList.contains('disabled')) {
                    button.classList.remove('disabled');
                } else {
                    button.disabled = false;
                }
            }
        }
    }

    function getJsonCookie(name) {
        const cookieString = getCookie(name);

        if (cookieString.length > 0) {
            return JSON.parse(cookieString);
        }

        return {};
    }

    function setJsonCookie(name) {
        let cookieObject;

        if (name === 'innogy_consumption') {
            cookieObject = consumption;
        } else if (name === 'innogy_pd') {
            cookieObject = productData;
        }

        const isEmpty = Object.keys(cookieObject).length === 0;

        if (!isEmpty) {
            setCookie(name, JSON.stringify(cookieObject), 30);
        } else {
            removeCookie(name);
        }
    }

    function removeCookie(name) {
        setCookie(name, '', -1);
    }
}
