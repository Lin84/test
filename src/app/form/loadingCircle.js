function createLoadingCircle() {
    if (!document.querySelector('.loader-overlay')) {
        const loadingCircleHtml = document.createElement('div');
        loadingCircleHtml.className = 'loader-overlay';
        loadingCircleHtml.innerHTML = '<div class="loader loader-circle"></div>';
        document.body.appendChild(loadingCircleHtml);
    }
}

function removeLoadingCircle() {
    if (document.querySelector('.loader-overlay')) {
        document.querySelector('.loader-overlay').classList.remove('js-loader-active');
        document.body.removeChild(document.querySelector('.loader-overlay'));
    }
}

function showLoadingCircle() {
    if (document.querySelector('.loader-overlay')) {
        document.querySelector('.loader-overlay').classList.add('js-loader-active');
        setTimeout(removeLoadingCircle, 30000);
    }
}

export { createLoadingCircle, removeLoadingCircle, showLoadingCircle };
