export default function functionLog() {

    window.addEventListener('resize', onLoginWinResize);

    onLoginWinResize();
}

function onLoginWinResize() {

    const info = document.querySelectorAll('[data-tpl="loginForm-helper"]');

    const windowWidth = info[0].parentNode.clientWidth;

    if (windowWidth > 800) {

        info[0].classList.remove('col-lg-12');
        info[1].classList.remove('col-lg-12');
        info[0].classList.add('col-lg-6');
        info[1].classList.add('col-lg-6');
    } else {

        info[0].classList.remove('col-lg-6');
        info[1].classList.remove('col-lg-6');
        info[0].classList.add('col-lg-12');
        info[1].classList.add('col-lg-12');
    }
}
