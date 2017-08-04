function ifEmpty(inputs) {
    const inputsLength = inputs.length;
    let validated = 0;

    for (let i = 0; i < inputsLength; i += 1) {
        const currentInput = inputs[i];
        const tag = currentInput.tagName;
        let formGroup;

        if (tag === 'INPUT') {
            formGroup = currentInput.parentNode.parentNode;
        } else if (tag === 'SELECT') {
            formGroup = currentInput.parentNode.parentNode.parentNode;
        }

        const warningText = currentInput.getAttribute('requiredMessage');
        const errorBlock = formGroup.querySelector('.error-block');

        if (currentInput && currentInput.value.length < 1) {
            if (!errorBlock) { return false; }
            errorBlock.innerHTML = warningText;
            formGroup.classList.add('error');
        } else {
            validated += 1;
            formGroup.classList.remove('error');

            if (validated === inputsLength) {
                return true;
            }
        }

    }

    return null;
}

function ifEmptyPassword(inputs) {
    const inputsLength = inputs.length;
    let validated = 0;

    for (let i = 0; i < inputsLength; i += 1) {
        const currentInput = inputs[i];
        const tag = currentInput.tagName;
        const formGroup = currentInput.parentNode.parentNode.parentNode;

        const warningText = currentInput.getAttribute('requiredMessage');
        const errorBlock = formGroup.querySelector('.error-block');

        if (currentInput && currentInput.value.length < 1) {
            if (!errorBlock) { return false; }
            errorBlock.innerHTML = warningText;
            formGroup.classList.add('error');
        } else {
            validated += 1;
            formGroup.classList.remove('error');

            if (validated === inputsLength) {
                return true;
            }
        }
    }

    return null;
}

function validPattern(inputs) {
    const inputsLength = inputs.length;
    let validated = 0;
    let reg;


    for (let i = 0; i < inputsLength; i += 1) {
        const currentInput = inputs[i];

        const tag = currentInput.tagName;
        let formGroup;

        if (tag === 'INPUT') {
            formGroup = currentInput.parentNode.parentNode;
        } else if (tag === 'SELECT') {
            formGroup = currentInput.parentNode.parentNode.parentNode;
        }

        const inputValue = currentInput.value.replace(/ /g, '');
        const warningText = currentInput.getAttribute('patternMessage');
        const errorBlock = formGroup.querySelector('.error-block');
        const dataPattern = currentInput.getAttribute('data-pattern');
        const reg = new RegExp(dataPattern);

        if (!reg.test(inputValue) && inputValue.length > 0) {
            if (!errorBlock) { return false; }
            errorBlock.innerHTML = warningText;
            formGroup.classList.add('error');
        } else {
            validated += 1;
            formGroup.classList.remove('error');

            if (validated === inputsLength) {
                validated += 1;
                return true;
            }
        }
    }

    return null;
}

function ifCorrectLength(inputs) {
    const inputsLength = inputs.length;

    let validated = 0;
    for (let i = 0; i < inputsLength; i += 1) {
        const currentInput = inputs[i];
        const tag = currentInput.tagName;
        let formGroup;

        if (tag === 'INPUT') {
            formGroup = currentInput.parentNode.parentNode;
        } else if (tag === 'SELECT') {
            formGroup = currentInput.parentNode.parentNode.parentNode;
        }

        const inputLength = currentInput.value.length;
        const warningText = currentInput.getAttribute('exactLengthMessage');
        const errorBlock = formGroup.querySelector('.error-block');
        const length = currentInput.getAttribute('exactLength');

        if (inputLength === length) {
            validated += 1;
            formGroup.classList.remove('error');

            if (validated === inputsLength) {
                validated += 1;
                return true;
            }
        } else {
            if (!errorBlock) { return false; }
            errorBlock.innerHTML = warningText;
            formGroup.classList.add('error');
        }
    }

    return null;
}

function ifEqual(inputs) {
    let val;

    for (let i = 0; i < inputs.length; i += 1) {
        const currentInput = inputs[i];
        const formGroup = currentInput.parentNode.parentNode.parentNode;
        const warningText = currentInput.getAttribute('isEqualMessage');
        const errorBlock = formGroup.querySelector('.error-block');

        if (i === 0) {
            val = currentInput.value;
        } else {
            if (val === currentInput.value) {
                return true;
            }
            if (!errorBlock) { return false; }
            errorBlock.innerHTML = warningText;
            formGroup.classList.add('error');
            return false;
        }
    }

    return null;
}

function ifNotEqual(inputs) {
    let val;

    for (let i = 0; i < inputs.length; i += 1) {
        const currentInput = inputs[i];
        const formGroup = currentInput.parentNode.parentNode.parentNode;
        const warningText = currentInput.getAttribute('isNotEqualMessage');
        const errorBlock = formGroup.querySelector('.error-block');

        if (i === 0) {
            val = currentInput.value;
        } else {
            if (val !== currentInput.value) {
                return true;
            }
            if (!errorBlock) { return false; }
            errorBlock.innerHTML = warningText;
            formGroup.classList.add('error');
            return false;
        }
    }

    return null;
}

function ifCorrectRange(inputs) {
    const inputsLength = inputs.length;
    let validated = 0;

    for (let i = 0; i < inputsLength; i += 1) {
        const currentInput = inputs[i];
        const inputValue = parseInt(currentInput.value.trim(), 10);
        const inputMin = parseInt(currentInput.getAttribute('data-min'), 10);
        const inputMax = parseInt(currentInput.getAttribute('data-max'), 10);
        const formGroup = currentInput.parentNode.parentNode;
        const errorBlock = formGroup.querySelector('.error-block');
        const warningText = currentInput.getAttribute('rangeMessage');

        if (inputValue >= inputMin && (inputMax >= inputValue || isNaN(inputValue))) {
            validated += 1;
            formGroup.classList.remove('error');

            if (validated === inputsLength) {
                validated += 1;
                return true;
            }
        } else {
            if (!errorBlock) { return false; }
            errorBlock.innerHTML = warningText;
            formGroup.classList.add('error');
        }
    }

    return null;
}

export {
    ifCorrectLength,
    ifCorrectRange,
    ifEmpty,
    ifEmptyPassword,
    ifEqual,
    ifNotEqual,
    validPattern
};
