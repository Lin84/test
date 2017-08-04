export default function() {
    if (window.history.length <= 1) {
        const selectors = document.querySelectorAll('[data-tpl="bnv01"]');
        let i = 0;
        const l = selectors.length;

        for (i; i < l; i += 1) {
            const anchor = selectors[i].querySelector('a[href]');

            if (!anchor) {
                selectors[i].style.display = 'none';
            }
        }
    }
}
