import { Observable } from 'rxjs/Observable';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { startWith } from 'rxjs/operator/startWith';
import { mergeMap } from 'rxjs/operator/mergeMap';
import { map } from 'rxjs/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/filter';

import { fasterdomPromised as dom } from '../../fasterdom/fasterdom';

const scope                = window,
      Events               = {
	      WHEEL :  'wheel',
	      SCROLL : 'scroll'
      }, SCROLL_DIRECTIONS = {

	      UP :        Symbol( 'up' ),
	      DOWN :      Symbol( 'down' ),
	      LEFT :      Symbol( 'left' ),
	      RIGHT :     Symbol( 'right' ),
	      UNDEFINED : Symbol( 'undefined' )
      };

/**
 * @typedef {object} ScrollPosition
 * @property {int|undefined} x - scroll value on x-axis
 * @property {int|undefined} y - scroll value on y-axis
 * @propert {Symbol} direction - the current scroll direction
 */

/**
 *
 * @type {ScrollPosition}
 */
let cache = {};

/**
 * Cache the current data.
 * @param {ScrollPosition} data - current scroll position
 * @return {ScrollPosition} the new cached scroll position
 */
function cacheAndReturn ( data ) {
	cache = data;

	return cache;
}

/**
 * Check whether the emitted scroll position relally changed.
 * @param {ScrollPosition} data - current scroll position
 * @return {boolean}
 */
function didChange ( data ) {

	return data !== cache;
}

/**
 * Try to return the cached result first to avoid recalculation and layout trashing
 * @return {Promise<void>|Promise.<*>|Promise<T>|Promise<WindowDimensions>} - promised value
 */
function tryCachedReturn () {

	return cache.x !== undefined && cache.y !== undefined ?
	       Promise.resolve( cache ) :
	       getWindowScroll();
}

/**
 * Compare the current scroll position against the last scroll position to determine the direction.
 * @param {ScrollPosition} data - new scroll data
 * @param {ScrollPosition} cache - cached scroll data
 * @return {symbol|*|Symbol} a symbol for the current direction
 */
function determineDirection ( data, cache ) {

	const oldX = cache.x,
	      oldY = cache.y,
	      newX = data.x,
	      newY = data.y;

	if ( oldX !== undefined && oldY !== undefined ) {

		return newY > oldY ?
		       SCROLL_DIRECTIONS.DOWN :
		       newY < oldY ?
		       SCROLL_DIRECTIONS.UP :
		       newX > oldX ?
		       SCROLL_DIRECTIONS.LEFT :
		       newX < oldX ?
		       SCROLL_DIRECTIONS.RIGHT :
		       cache.direction;
	} else {

		return SCROLL_DIRECTIONS.UNDEFINED;
	}
}

/**
 * Calculate the window scroll position
 * @returns {Promise} - a fasterdom promise whch will resolve with a {ScrollPosition} object
 */
function getWindowScroll () {

	return dom.measure( () => {

		let scrollX = 0,
		    scrollY = 0;

		if ( typeof window.pageYOffset === 'number' ) {
			scrollY = window.pageYOffset;
			scrollX = window.pageXOffset;
		} else if ( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) { // DOM
			scrollY = document.body.scrollTop;
			scrollX = document.body.scrollLeft;
		} else if ( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) { // IE6
			scrollY = document.documentElement.scrollTop;
			scrollX = document.documentElement.scrollLeft;
		}

		const normalizedX = scrollX < 0 ?
		                    0 :
		                    Math.floor( scrollX ),
		      normalizedY = scrollY < 0 ?
		                    0 :
		                    Math.floor( scrollY );

		return {
			/**
			 * @type {int} x - scroll position x
			 */
			x : normalizedX,
			/**
			 * @type {int} y - scroll position y
			 */
			y : normalizedY,

			direction : determineDirection( { x : normalizedX, y : normalizedY }, cache )
		};
	} );
}

/**
 * @public
 * @returns {Observable<ScrollPosition>} - scroll event stream
 */
function registerScrollEventStream () {

	const wheelStream  = Observable::fromEvent( scope, Events.WHEEL ),
	      scrollStream = Observable::fromEvent( scope, Events.SCROLL );

	return wheelStream.merge( scrollStream )
			::startWith( getWindowScroll )
			::mergeMap( getWindowScroll )
			.filter( didChange )
			::map( cacheAndReturn );
}

/**
 * Scroll to a position.
 * @param {ScrollPosition} data - coordinates
 * @param {object} options - Scroll options
 */
function scrollToPosition(data, options = {animated: false}) {

	window.scrollTo(data.x, data.y);
}

const ScrollService = { // eslint-disable-line one-var

	scrollEvent : registerScrollEventStream(),
	getCurrent :  tryCachedReturn,
	toPosition: scrollToPosition
};

export { SCROLL_DIRECTIONS as DIRECTIONS };
export default ScrollService;
