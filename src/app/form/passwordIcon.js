export default (input) => {
    const span = input.previousElementSibling;
    let focus = false;
    let isRevealed = false;

    function hideIcon() {
        span.style.visibility = 'hidden';
        input.type = 'password';
        span.classList.remove('icon_eye_closed');
        span.classList.add('icon_eye_open');
    }

    function showIcon() {
        span.style.visibility = 'visible';
    }

    input.onfocus = () => {
        focus = true;
        showIcon();
    };
    input.onblur = () => {
        focus = false;
        if (input.value.length === 0) {
            hideIcon();
        }
    };
    input.onmouseleave = () => {
        if (input.value.length === 0 && !focus) {
            hideIcon();
        }
    };
    input.onmouseenter = () => {
        if (focus) {
            showIcon();
        }
    };
    span.onmouseleave = () => {
        if (input.value.length === 0 && !focus) {
            hideIcon();
        }
    };
    span.onclick = () => {
        toggle();
    };
    /* span.onmousedown = () => {
        touchingStart();
    };
    span.onmouseup = () => {
        touchingEnd();
    }; */

    /* span.addEventListener('touchstart', () => {
        touchingStart();
    });

    span.addEventListener('touchend', () => {
        touchingEnd();
    }); */

    span.oncontextmenu = (e) => {
        e.preventDefault();
        if (e.defaultPrevented) {
            e.stopPropagation();
        }
        return false;
    };

    function toggle() {
        if (!isRevealed) {
            input.type = 'text';
            span.classList.remove('icon_eye_closed');
            span.classList.add('icon_eye_open');
        } else {
            input.type = 'password';
            span.classList.remove('icon_eye_open');
            span.classList.add('icon_eye_closed');
            input.focus();
        }

        isRevealed = !isRevealed;
    }

    /* function touchingStart() {
        input.type = 'text';
        span.classList.remove('icon_eye_closed');
        span.classList.add('icon_eye_open');
    }

    function touchingEnd() {
        input.type = 'password';
        span.classList.remove('icon_eye_open');
        span.classList.add('icon_eye_closed');
        input.focus();
    } */
};
