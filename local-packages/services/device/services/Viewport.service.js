//import $ from 'cash-dom';
import { fasterdomPromised as dom } from '../../fasterdom/fasterdom';

const cache  = {
	      width :        null,
	      height :       null,
	      windowHeight : null,
	      windowWidth :  null
      },
      $scope = window;

/**
 * @typedef {object} Position within the document
 * @param {int} top - top pos
 * @param {int} left - left pos
 * @param {int} right - right pos
 * @param {int} bottom - bottom pos
 */

/**
 * Measure the viewport using {FasterDom}.
 * Is provided as a singleton.
 */
class ViewportService {

	/**
	 * Try to return the cached result first to avoid recalculation and layout trashing
	 * @return {Promise<void>|Promise.<*>|Promise<T>|Promise<WindowDimensions>} - promised value
	 */
	tryCachedReturn () {

		return cache.width && cache.height ?
		       Promise.resolve( cache ) :
		       this.getSize();
	}

	/**
	 * Determine the size of the viewport.
	 * @return {Promise} promise which will resolve to an object containing width and height
	 */
	getSize () {

		return dom.measure( () => {

			cache.width  = Math.max( $scope.outerWidth, $scope.innerWidth );
			cache.height = Math.max( $scope.outerHeight, $scope.innerHeight );

			return {
				width :  cache.width,
				height : cache.height
			};
		} );
	}

	/**
	 * Get the current position of an element within the Viewport.
	 * @param {HTMLElement} element - dom element to find
	 * @return {Promise} promise which will resolve to {Position}
	 */
	getPosition ( element ) {

		return dom.measure( () => {

			const rect = element.getBoundingClientRect();

			return {
				top :    Math.round( rect.top ),
				right :  Math.round( rect.right ),
				bottom : Math.round( rect.bottom ),
				left :   Math.round( rect.left )
			};
		} );
	}

	/**
	 * Determine if the position of a given item is within the viewport.
	 * @param {HTMLElement} element - the element to find
	 * @param {int} OFFSET [param=0] - offset to widen the viewport to fuzzy match
	 * @return {Promise|Promise<T>} - promise will be resolved after the viewport was determined.
	 */
	isVisible ( element, OFFSET = 0 ) {

		return new Promise( ( resolve ) => {

			Promise.all( [ this.tryCachedReturn(), this.getPosition( element ) ] )
					.then( ( values ) => {

						const
								viewport = values [ 0 ],
								position = values [ 1 ];

						resolve(
								( position.top >= -OFFSET && position.top <= viewport.height + OFFSET )
								||
								( position.bottom >= -OFFSET && position.bottom <= viewport.height - OFFSET )
						);
					} );
		} );
	}
}

const instance = new ViewportService();//eslint-disable-line

export default instance;
