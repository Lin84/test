export default (tab) => {
    /*
        Events of sitecore tabs for showing/hiding component's states, variations etc.
    */

    tab.addEventListener('click', () => {
        const classActive = 'is-active';

        const componentName = tab.getAttribute('data-scomponent-tab');
        const componentObj = document.querySelector(`[data-scomponent="${componentName}"]`);

        // Remove active class from all tabs and components
        document.querySelectorAll('[data-scomponent-tab], [data-scomponent]').forEach((obj) => {
            obj.classList.remove(classActive);
        });

        // Add active class to specific tab and component
        tab.classList.add(classActive);
        componentObj.classList.add(classActive);
    }, false);
};
