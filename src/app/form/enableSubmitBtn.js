function selectEnableSubmit(allSelectsTpl, cdeSubmit) {
    // enable button if selected customer's data changed:
    for (let i = 0; i < allSelectsTpl.length; i += 1) {
        const currentValue = allSelectsTpl[i].querySelector('select').value;

        allSelectsTpl[i].addEventListener('click', () => {
            const customSelect = allSelectsTpl[i].querySelector('.custom-options');

            customSelect.addEventListener('click', (e) => {
                const newValue = e.target.innerHTML;
                if (currentValue.localeCompare(newValue)) {
                    cdeSubmit.classList.remove('disabled');
                }
            });
        });
    }
}

function formGroupEnableSubmit(cdeFormGroups, cdeSubmit) {
    // enable Save button if inputed custmer's data has changed:
    for (let i = 0; i < cdeFormGroups.length; i += 1) {
        const currentForm = cdeFormGroups[i];
        currentForm.addEventListener('change', () => {
            cdeSubmit.classList.remove('disabled');
        });
    }
}

function dateGroupEnableSubmit(cdeDateGroups, cdeSubmit) {
    let iconCalendar;
    let pickerWrap;
    let clicked;

    for (let i = 0; i < cdeDateGroups.length; i += 1) {
        clicked = false;
        iconCalendar = cdeDateGroups[i].querySelector('.icon-calendar');
        /* eslint-disable */
        iconCalendar.addEventListener('click', (e) => {
            pickerWrap = this.querySelector('.picker__wrap');
            pickerWrap.addEventListener('click', (e) => {
                clicked = true;
                if (clicked) {
                    cdeSubmit.classList.remove('disabled');
                } else {
                    clicked = false;
                }
            });
        });
        /* eslint-enable */
    }
}

export { selectEnableSubmit, formGroupEnableSubmit, dateGroupEnableSubmit };
