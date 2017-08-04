// will use in the future for generic validation, for now see in validationRules.js

export default function(container) {
    const input = container.querySelector('input');
    const inputValue = input.value.replace(/ /g, '');
    const warningText = container.getAttribute('only-number');
    const errorBlock = container.querySelector('.error-block');
    const reg = /^(0|[1-9][0-9]*)$/;
    if (!reg.test(inputValue) && inputValue.length > 0) {
        errorBlock.innerHTML = warningText;
        container.classList.add('error');
    } else {
        // console.log("true for onlyNumber validation");
    }
}
