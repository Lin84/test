export default function disableEditBtn(btn) {
    btn.addEventListener('click', (e) => {
        e.target.setAttribute('data-actived', 'true');

        const allIebs = document.querySelectorAll('[data-tpl="ieb01"]');
        [...allIebs].forEach((ieb) => {
            const currentEditBtn = ieb.querySelector('.formEdit__edit');

            if (currentEditBtn.getAttribute('data-actived')) return;

            currentEditBtn.classList.add('disabled');
            currentEditBtn.setAttribute('disabled', 'true');
        });
    });
}
