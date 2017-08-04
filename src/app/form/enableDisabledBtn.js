import { hasClass } from '../helpers';

export default function enableDisabledBtn(btn) {
    if (hasClass(btn, 'formEdit__cancel')) {
        btn.addEventListener('click', enableButton);
    } else {
        enableButton();
    }

    function enableButton() {
        const allEditBtns = document.querySelectorAll('.formEdit__edit');
        const allEditBtnsLength = allEditBtns.length;
        for (let i = 0; i < allEditBtnsLength; i += 1) {
            const currentBtn = allEditBtns[i];
            currentBtn.classList.remove('disabled');
            currentBtn.removeAttribute('data-actived');
            currentBtn.removeAttribute('disabled');
        }
    }
}
