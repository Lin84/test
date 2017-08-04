import init from '../init';
import axios from 'axios';
import { ifEmpty, ifEmptyPassword, ifEqual, ifNotEqual } from './validationRules';
import { createLoadingCircle, removeLoadingCircle, showLoadingCircle } from '../loadingCircle';
import { formGroupEnableSubmit, selectEnableSubmit } from './enableSubmitBtn';

export default function(container) {
    const formView = container.querySelector('.formView');
    const formAfterView = container.querySelector('.formAfterView');
    const editBtn = formView.querySelector('button');
    const successMsg = formView.querySelector('.formView__success-msg');

    const formEdit = container.querySelector('.formEdit');
    const formEditForm = formEdit.querySelector('form');
    const formEditFormGroups = formEdit.getElementsByClassName('form-group');
    const cancelBtn = formEdit.querySelector('.formEdit__cancel');
    const submitBtn = formEdit.querySelector('.formEdit__submit');
    const cancelBtnAfterView = formAfterView.querySelector('.formAfterView__cancel');
    const submitBtnAfterView = formAfterView.querySelector('.formAfterView__submit');
    const allSelectsTpl = formEdit.querySelectorAll('[data-tpl="select"]');
    const requireds = formEdit.querySelectorAll('[required="true"]');
    const equal = formEdit.querySelectorAll('[data-equal]');
    const notEqual = formEdit.querySelectorAll('[data-not-equal]');

    const allInputs = formEditForm.querySelectorAll('input, select');
    const requestUrl = formEditForm.getAttribute('customer-data-url');
    const customerId = formEditForm.getAttribute('customer-data-id');
    const lang = document.querySelector('html').getAttribute('lang');

    let data;
    let ifNotEmpty;
    let isEqual;
    let isNotEqual;

    init(createLoadingCircle, document.querySelector('body'));

    editBtn.addEventListener('click', () => {
        formView.classList.add('hidden');
        formEdit.classList.remove('hidden');
    });

    cancelBtn.addEventListener('click', () => {
        formEdit.classList.add('hidden');
        formView.classList.remove('hidden');
    });

    cancelBtnAfterView.addEventListener('click', () => {
        formEdit.classList.add('hidden');
        formView.classList.remove('hidden');
        formAfterView.classList.add('hidden');
        successMsg.classList.add('hidden');
    });

    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        validateForm();

        if (ifNotEmpty) {
            // showing the loading circle:
            createLoadingCircle();
            showLoadingCircle();

            // gather data from form after FE validation:
            gatherData();
            // console.log(data);

            // to submit form:
            // console.log('Post data of Customer Data Form to back end');
            // axios(requestUrl, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json; charset=utf-8',
            //         'Accept-Language': lang
            //     },
            //     data: data,
            // })

            // for now just close the edit mode and open view mode width success message displayed:
            formEdit.classList.add('hidden');
            formView.classList.add('hidden');
            formAfterView.classList.remove('hidden');
        }
    });

    submitBtnAfterView.addEventListener('click', (e) => {
        e.preventDefault();
        createLoadingCircle();
        showLoadingCircle();

        // for now just close the edit mode and open view mode width success message displayed:
        formEdit.classList.add('hidden');
        formView.classList.remove('hidden');
        formAfterView.classList.add('hidden');
        successMsg.classList.remove('hidden');
        clearForm();
    });

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
    selectEnableSubmit(allSelectsTpl, submitBtn);

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
}
