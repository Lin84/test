import { createLoadingCircle, showLoadingCircle, removeLoadingCircle } from '../loadingCircle';

export default (btn) => {
    btn.addEventListener('click', (e) => {
        // e.preventDefault();
        createLoadingCircle();
        showLoadingCircle();
        setTimeout(() => {
            if (document.querySelector('.loader-overlay')) {
                removeLoadingCircle();
            }
        }, 30000);
    }, false);
};
