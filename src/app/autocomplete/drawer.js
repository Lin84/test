import axios from 'axios';
import nunjucks from 'nunjucks';

export default function Drawer(drawer, lang, selectorSuggestions) {
    const inputSearch = drawer.querySelector('.search-input');
    const btnSearch = drawer.querySelector('.search-button');
    const searchForm = drawer.querySelector('form');
    const autocomplete = drawer.querySelector('.autocomplete');
    const suggestions = drawer.querySelector(selectorSuggestions);
    const requestUrl = drawer.getAttribute('data-service-url');
    const serviceId = drawer.getAttribute('data-service-id');
    const searchUrl = drawer.getAttribute('data-search-url');

    /* Templates */
    const PAGE_ORIGIN = window.location.origin;
    const env = nunjucks.configure(`${PAGE_ORIGIN}/js/Innogy/templates`, { web: { useCache: true } });
    const tplAutocomplete = env.getTemplate('autocomplete.nunj');

    // Init events
    inputSearch.addEventListener('input', (e) => {
        if (requestUrl) {
            const charCount = document.activeElement.value.length;

            if (charCount > 2) {
                loadResults(inputSearch, requestUrl, serviceId, suggestions, autocomplete);
            } else {
                suggestionsClose(autocomplete);
            }
        }
    }, false);

    suggestions.addEventListener('click', (e) => {
        selectSuggestion(e.target, inputSearch, autocomplete);
    }, false);

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (inputSearch.value.trim() !== '') {
            redirectWithQuery(inputSearch, searchUrl);
        }
    }, true);

    // Functions
    function suggestionsClose(autocomplete) {
        autocomplete.classList.remove('suggestions-open');
    }

    function loadResults(inputSearch, requestUrl, serviceId, suggestions, autocomplete) {
        const searchQuery = inputSearch.value;

        axios(requestUrl, {
            method: window.isDev ? 'GET' : 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Accept-Language': lang
            },
            data: JSON.stringify({
                q: searchQuery,
                id: serviceId
            })
        })
        .then((response) => {
            if (response.data.results.length > 0) {
                checkInputField(autocomplete);
                renderResults(response.data, suggestions);
            }
        })
        .catch((error) => {
            // ToDo: Handle exception
            // console.log(error);
        });
    }

    function renderResults(searchResults, el) {
        el.innerHTML = nunjucks.render(tplAutocomplete, {
            searchResults
        });
    }

    function checkInputField(autocomplete) {
        const charCount = document.activeElement.value.length;

        if (charCount > 2) {
            suggestionsOpen(autocomplete);
        } else {
            suggestionsClose(autocomplete);
        }
    }

    function selectSuggestion(tar, input, autocomplete) {
        if (tar.tagName === 'LI') {
            const newHTML = tar.innerHTML;

            input.value = newHTML;

            suggestionsClose(autocomplete);
        }
    }

    function suggestionsOpen(autocomplete) {
        autocomplete.classList.add('suggestions-open');
    }

    function redirectWithQuery(inputSearch, searchUrl) {
        const query = encodeURIComponent(inputSearch.value.trim()).replace(/%20/g, '+');
        // ToDo: Clean the code!
        // window.location.replace(searchUrl + '?q=' + query);
        window.location.replace(`${searchUrl}?q=${query}`);
    }

    function replaceAll(str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    }
}
