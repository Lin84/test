import init from '../init';
import axios from 'axios';
import { ifEmpty, ifEmptyPassword, ifEqual, ifNotEqual } from './validationRules';
import { createLoadingCircle, removeLoadingCircle, showLoadingCircle } from './loadingCircle';
import { formGroupEnableSubmit } from './enableSubmitBtn';
import passwordIcon from '../form/passwordIcon';
import formTooltip from '../form/formTooltip';
import factory from '../factory';

export default function (container) {
    let formView = container.querySelector('.formView');
    let editBtn = formView.querySelector('button');
    let successMsg = formView.querySelector('.formView__success-msg');

    let formEdit = container.querySelector('.formEdit');
    let formEditForm = formEdit.querySelector('form');
    let formEditFormGroups = formEdit.getElementsByClassName('form-group');
    let cancelBtn = formEdit.querySelector('.formEdit__cancel');
    let submitBtn = formEdit.querySelector('.formEdit__submit');
    let allSelectsTpl = formEdit.querySelectorAll('[data-tpl="select"]');
    let requireds = formEdit.querySelectorAll('[required="true"]');
    let equal = formEdit.querySelectorAll('[data-equal]');
    let notEqual = formEdit.querySelectorAll('[data-not-equal]');

    let allInputs = formEditForm.querySelectorAll('input, select');
    let requestUrl = formEditForm.getAttribute('customer-data-url');
    let customerId = formEditForm.getAttribute('customer-data-id');
    let lang = document.querySelector('html').getAttribute('lang');

    let data;
    let ifNotEmpty;
    let isEqual;
    let isNotEqual;

    init(createLoadingCircle, document.querySelector('body'));

    document.addEventListener('click', e => {
        if (e.target === document.querySelector('[data-tpl="customer-password"] .formView button')) {
            formView.classList.add('hidden');
            formEdit.classList.remove('hidden');
        }
    }, false);

    document.addEventListener('click', e => {
        if (e.target === document.querySelector('[data-tpl="customer-password"] .formEdit .formEdit__cancel')) {
            formEdit.classList.add('hidden');
            formView.classList.remove('hidden');
        }
    }, false);

    document.addEventListener('click', e => {
        if (e.target === document.querySelector('[data-tpl="customer-password"] .formEdit .formEdit__submit')) {
            e.preventDefault();
            validateForm();

            if (ifNotEmpty && isEqual && isNotEqual) {
                // showing the loading circle:
                createLoadingCircle();
                showLoadingCircle();

                // gather data from form after FE validation:
                gatherData();

                const requestUrl = formEditForm.getAttribute('customer-data-url');
                const CurrentPassword = document.getElementById('CurrentPassword').value;
                const NewPassword = document.getElementById('NewPassword').value;
                const ConfirmNewPassword = document.getElementById('ConfirmNewPassword').value;
                const ItemId = document.getElementById('ItemId').value;
                const LanguageName = document.getElementById('LanguageName').value;

                if (requestUrl && requestUrl !== '') {
                    axios(requestUrl, {
                        method: window.isDev ? 'GET' : 'POST',
                        context: this,
                        headers: {
                            'Accept-Language': lang
                        },
                        data: {
                            ConfirmNewPassword,
                            CurrentPassword,
                            ItemId,
                            LanguageName,
                            NewPassword
                        }
                    })
                        .then((response) => {
                            document.querySelector('[data-tpl="customer-password"]').outerHTML = response.data;
                            removeLoadingCircle();
                            reassignVars();

                            const event = document.createEvent('HTMLEvents');
                            event.initEvent('message', true, true);
                            event.eventName = 'message';
                            event.data = JSON.stringify({ type: 'formReady', data: { id: 'passwordEditForm' } });
                            window.dispatchEvent(event);

                            factory(passwordIcon, document.querySelectorAll('input[type="password"]'));
                            factory(formTooltip, document.querySelectorAll('[data-tpl="tooltip"]'));

                            formGroupEnableSubmit(formEditFormGroups, submitBtn);
                        })
                        .catch((error) => {
                            // console.log(error);
                        });
                } else {
                    // console.log("Request url is missing!");
                }

                // for now just close the edit mode and open view mode width success message displayed:
                // these steps must be done after successfull validation and response from server
                /*
                formEdit.classList.add('hidden');
                formView.classList.remove('hidden');
                successMsg.classList.remove('hidden');
                clearForm();
                */
            }
        }
    }, false);

    function validateForm() {
        if (ifEmptyPassword(requireds)) {
            ifNotEmpty = true;
        } else {
            ifNotEmpty = false;
        }

        if (requireds.length === 0) { ifNotEmpty = true; }

        if (ifEqual(equal)) {
            isEqual = true;
        } else {
            isEqual = false;
        }

        if (equal.length === 0) { isEqual = true; }

        if (ifNotEqual(notEqual)) {
            isNotEqual = true;
        } else {
            isNotEqual = false;
        }

        if (notEqual.length === 0) { isNotEqual = true; }
    }

    formGroupEnableSubmit(formEditFormGroups, submitBtn);

    function gatherData() {
        data = {};

        for (let i = 0; i < allInputs.length; i += 1) {
            const currentInput = allInputs[i];
            data[currentInput.name] = currentInput.value;
        }

        data = JSON.stringify(data);
        return data;
    }

    function clearForm() {
        allInputs.forEach((input) => {
            input.value = '';
        });
    }

    function reassignVars() {
        formView = document.querySelector('[data-tpl="customer-password"] .formView');
        editBtn = formView.querySelector('button');
        successMsg = formView.querySelector('.formView__success-msg');

        formEdit = document.querySelector('[data-tpl="customer-password"] .formEdit');
        formEditForm = formEdit.querySelector('form');
        formEditFormGroups = formEdit.getElementsByClassName('form-group');
        cancelBtn = formEdit.querySelector('.formEdit__cancel');
        submitBtn = formEdit.querySelector('.formEdit__submit');
        allSelectsTpl = formEdit.querySelectorAll('[data-tpl="select"]');
        requireds = formEdit.querySelectorAll('[required="true"]');
        equal = formEdit.querySelectorAll('[data-equal]');
        notEqual = formEdit.querySelectorAll('[data-not-equal]');

        allInputs = formEditForm.querySelectorAll('input, select');
        requestUrl = formEditForm.getAttribute('customer-data-url');
        customerId = formEditForm.getAttribute('customer-data-id');
        lang = document.querySelector('html').getAttribute('lang');

        data = null;
        ifNotEmpty = null;
        isEqual = null;
        isNotEqual = null;
    }
}
