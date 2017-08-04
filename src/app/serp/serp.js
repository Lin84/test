import axios from 'axios';
import tplResults from './serp.nunj';
import tplItems from './serp-items.nunj';
import tplFooter from './serp-footer.nunj';
import tplDisplayedResults from './serp-displayed-results.nunj';

export default function() {
    const idBtnShowMore = 'btn-request-show-more';
    const lang = document.querySelector('html').getAttribute('lang');
    let searchQuery = getUrlVar('q');
    let displayedResultsCount = 0;
    let pageIndex = 0;
    let skipNumbers = {};
    const renderTargetElement = '[data-tpl="src01"]';
    const renderTargetItemsElement = '[data-tpl="src01"] ol';
    const renderTargetFooterElement = '[data-tpl="src01"] footer';
    const renderTargetDisplayedItemsElement = '[data-tpl="src01"] .page-current';
    const requestUrl = document.querySelector(renderTargetElement).getAttribute('data-service-url');
    const serviceId = document.querySelector(renderTargetElement).getAttribute('data-service-id');
    let firstLoad = true;
    let gridClass;
    let store = {}; // Will contain all displayed results

    /* eslint-disable */
    // NEED TO REWRITE
    init();

    function init() {
        initEvents();
        decodeQuery();
        loadResults(init = true);
    }
    /* eslint-enable */

    function initEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.id === idBtnShowMore) {
                pageIndex += 1;
                e.target.classList.add('hidden');
                // document.querySelector(renderTargetElement + ' .loader').classList.add('js-loader-active');
                document.querySelector(`${renderTargetElement} .loader`).classList.add('js-loader-active');
                loadResults();
            }
        }, false);
    }

    function decodeQuery() {
        if (!searchQuery) {
            return;
        }

        searchQuery = decodeURIComponent(searchQuery.replace(/\+/g, '%20'));
    }

    function loadResults(init = false) {
        axios(requestUrl, {
            method: window.isDev ? 'GET' : 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Accept-Language': lang
            },
            data: JSON.stringify({
                q: searchQuery,
                index: pageIndex,
                id: serviceId,
                skipNumbers
            })
        })
        .then((response) => {
            store = response.data;
            skipNumbers = store.skipNumbers;
            displayedResultsCount += store.results.length;

            store.results.forEach((obj, index) => {
                if (!searchQuery) {
                    return;
                }

                const searchQueryWords = searchQuery.split(' ');

                searchQueryWords.forEach((q, i) => {
                    if (q !== '' && q !== '*') {
                        let str = obj.description;
                        str = removeTags(str);

                        if (str !== '' || str !== null || str !== undefined) {
                            const newStr = replaceAll(str, q);
                            store.results[index].description = newStr;
                        }
                    }
                });
            });

            gridClass = document.querySelector(renderTargetElement).className;

            if (init) {
                renderResults(store, renderTargetElement, tplResults);
            } else {
                renderResults(store, renderTargetItemsElement, tplItems, gridClass);
                renderResultsOverwrite(store, renderTargetFooterElement, tplFooter);
                renderResultsOverwrite(store, renderTargetDisplayedItemsElement, tplDisplayedResults);
            }

            if (store.results.length === 0 || displayedResultsCount >= response.data.totalResults) {
                noResults();
            } else {
                resultsFound();
            }

            if (!init) {
                document.getElementById(idBtnShowMore).classList.remove('hidden');
                // document.querySelector(renderTargetElement + ' .loader').classList.remove('js-loader-active');
                document.querySelector(`${renderTargetElement} .loader`).classList.remove('js-loader-active');
            }

            firstLoad = false;
        })
        .catch((error) => {
            // console.log(error);
        });
    }

    function renderResults(searchResults, selector, template, gridClass = '') {
        document.querySelector(selector).insertAdjacentHTML('beforeend', template.render({
            searchResults,
            searchQuery,
            displayedResultsCount,
            gridClass,
            firstLoad
        }));
    }

    function renderResultsOverwrite(searchResults, selector, template) {
        document.querySelector(selector).innerHTML = template.render({
            searchResults,
            searchQuery,
            displayedResultsCount
        });
    }

    function noResults() {
        const btn = document.getElementById('btn-request-show-more');

        if (btn) {
            btn.style.display = 'none';
        }
    }

    function resultsFound() {
        document.getElementById('btn-request-show-more').style.display = 'block';
    }

    // Helper functions

    /* eslint-disable */
    // NEED TO REWRITE
    function getUrlVar(name) {
        // if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search)) {
        if (name = (new RegExp(`[?&]${encodeURIComponent(name)}=([^&]*)`)).exec(location.search)) {
            return decodeURIComponent(name[1]);
        }
    }
    /* eslint-enable */

    function replaceAll(str, find) {
        return str.replace(new RegExp(find, 'gi'), '<strong>$&</strong>');
    }

    function removeTags(txt) {
        const rex = /(<([^>]+)>)/ig;
        return txt.replace(rex, '');
    }
}
