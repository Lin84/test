import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { mergeMap } from 'rxjs/operator/mergeMap';
import { filter } from 'rxjs/operator/filter';
import { map } from 'rxjs/operator/map';
import { startWith } from 'rxjs/operator/startWith';

import Viewport from './Viewport.service';

const scope  = window,
      Events = {
	      RESIZE : 'resize'
      };

let cache;

/**
 * @typedef {object} WindowDimensions
 * @property {int} width - The width of the current viewport
 * @property {int} height - The height of the current viewport
 */

/**
 * Cache the current result and return a reference to the cached result to enable strict === comparison
 * @param {WindowDimensions} data - the window measurements
 * @return {WindowDimensions} the cached window measurements
 */
function cacheSize ( data ) {

	cache = data;

	return cache;
}

/**
 * Check if the data has changed.
 * @param {WindowDimensions} data - the window measurements
 * @return {boolean} - whether data needs an update.
 */
function didChange ( data ) {

	return data !== cache;
}

/**
 * Try to return the cached result first to avoid recalculation and layout trashing
 * @return {Promise<void>|Promise.<*>|Promise<T>|Promise<WindowDimensions>} - either immediately resolve with cache or fetch new data from service
 */
function tryCachedReturn () {

	return cache ?
	       Promise.resolve( cache ) :
	       Viewport.getSize();
}

/**
 * Attach observable to window resize events.
 * @public
 * @return {Observable<WindowDimensions>} - stream of window resize events
 */
function registerResizeEventStream () {

	return Observable
			::fromEvent( scope, Events.RESIZE )
			::startWith( Viewport.getSize )
			::mergeMap( Viewport.getSize )
			::filter( didChange )
			::map( cacheSize );
}

const ResizeService = {

	resizeEvent : registerResizeEventStream(),
	getCurrent :  tryCachedReturn
};

export default ResizeService;
