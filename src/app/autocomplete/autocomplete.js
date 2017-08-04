import axios from 'axios';
import tplAutocomplete from './autocomplete.nunj';
import Drawer from './drawer';

export default function() {
    const lang = document.querySelector('html').getAttribute('lang');
    const drawers = document.querySelectorAll('[data-tpl="ses01"]');
    const bulb = document.querySelector('.search');
    const bulbParent = document.querySelector('#quick-navigation-right-list');
    const selectorSuggestions = '.suggestions';

    Array.from(drawers).forEach((drawer) => {
        Drawer(drawer, lang, selectorSuggestions);
    });

    checkSearch();

    function checkSearch() {
        const searchCount = document.querySelectorAll(selectorSuggestions).length;
        if (searchCount > 1 && bulb) {
            bulbParent.removeChild(bulb);
        }
    }
}
