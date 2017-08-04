import { hasClass } from './helpers';

export default function() {
    const allFormGroups = document.querySelectorAll('.form-group');
    if (!allFormGroups) return;

    for (let i = 0; i < allFormGroups.length; i += 1) {
        const currentForm = allFormGroups[i];
        const helps = currentForm.querySelectorAll('.help-block');
        if (!helps) return;

        for (let j = 0; j < helps.length; j += 1) {
            const currentHelp = helps[j];

            if (currentHelp.innerText.length > 0) {
                const text = currentHelp.innerText;

                currentHelp.parentElement.style.position = 'relative';
                currentHelp.className += ' help-block-icon';
                currentHelp.innerHTML = `<span class="tooltip-text">${text}<span class="tooltip-close icon icon-close_info"></span></span>`;
                currentHelp.addEventListener('click', (e) => {
                    if (hasClass(e.target, 'open')) {
                        e.target.classList.remove('open');
                    } else {
                        toggleTooltip(e.target);
                    }
                });
            }
        }
    }
    function toggleTooltip(e) {
        if (hasClass(e, 'tooltip-close')) {
            e.parentElement.parentElement.classList.remove('open');
        } else if (hasClass(e, 'help-block')) {
            e.classList.add('open');
        }
    }
}
