import { ResizeService } from '../../../local-packages/services/device/Device.service';
import { ScrollService } from '../../../local-packages/services/device/Device.service';
import Viewport from '../../../local-packages/services/device/services/Viewport.service.js';

import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { throttleTime } from 'rxjs/operator/throttleTime';
import { map } from 'rxjs/operator/map';
import { startWith } from 'rxjs/operator/startWith';

import Node from './entities/Node.entity';
import { STATE_VISIBLE } from './entities/Node.entity';
import { STATE_INVISIBLE } from './entities/Node.entity';

const
		cache    = [],
		INTERVAL = 200,
		REFRESH_INTERVAL = 600,
		OFFSET   = 100;

/**
 * Perform measurement of the dom node with {FasterDom} and make a new {Node} instance.
 * @param {HTMLElement} item - dom node
 * @return {Node}
 */
function wrap ( item ) {

	return new Node().init( item );
}

/**
 * Unwrap a given {Node} to provide acces to the original item.
 * @param {Node} node - the instance to unwrap.
 * @return {HTMLElement|*|HTMLAnchorElement}
 */
function unWrap ( node ) {

	return node.getRoot();
}

/**
 * Filter result based on visibility and return an array of pure {HTMLElement} dom nodes.
 * @param {Array<Node>} nodes - all nodes the service is watching
 * @param {Symbol} state - whether the items should have the property visible.
 * @return {Array<HTMLElement>} - visible/invisible items. {Node} instances are unwrapped and only the actual {HTMLElement}s are returned.
 */
function filterVisibility ( nodes, state ) {

	return nodes
			.filter( ( node ) => node.isVisible() === state )
			.map( unWrap );
}

/**
 * Sort items based on their visibility.
 * @param {Array.<Node>} nodes - all nodes the service is watching
 * @return {{visible: Array.<Node>, notVisible: Array.<Node>}} - an {object} containing nodes filtered on their current visibility
 */
function splitOnVisibility ( nodes ) {

	return {
		visible :    filterVisibility( nodes, STATE_VISIBLE ),
		notVisible : filterVisibility( nodes, STATE_INVISIBLE )
	};
}

/**
 * Check the node position against the Viewport. Pass the OFFSET to determine nodes which are near the viewport.
 * @param {Node} node - instance which should be determined
 * @return {Promise} - will be resolved when the visibility has been determined.
 */
function determineItemVisibility ( node ) {

	return Viewport
			.isVisible( node.getRoot(), OFFSET )
			.then( node.setVisibility.bind( node ) );
}

/**
 * Iterate all registered elements wrapped by a {Node} object to determine their visibility
 * @private
 * @param {Array.<Node>} nodes - all nodes the service is watching
 * @return {Promise<T[]>|Promise} - resolves when the visibility of all items was determined.
 */
function findVisibleItems ( nodes ) {

	return Promise.all( nodes.map( determineItemVisibility ) );
}

/**
 *
 * @return {Promise<T>|Promise} promise - resolves with visible and invisible items
 */
function checkWhichPositionsAreVisible ( list ) {

	return new Promise( ( resolve ) => {

		findVisibleItems( list )
				.then( ( nodes ) => resolve( splitOnVisibility( nodes ) ) );
	} );
}

/**
 * Refresh the scroll position on page load when the page is reloaded and the scroll position restored.
 * @return {void}
 */
function refreshPositionOnLoad() {

	setTimeout( () => {

		ScrollService.getCurrent()
				.then( ( data ) => {

					ScrollService.toPosition( {
						                          x : data.x,
						                          y : data.y - 1
					                          } );
				} );

	}, REFRESH_INTERVAL );
}

/**
 * Watches {Array<HTMLAnchorElement>} elements for their visibility inside the Viewport.
 * Updates on scroll and resize events and publishes updates via updateEvent - stream.
 *
 * This class is exported as a singleton instance.
 */
class InViewportService {

	constructor () {

		/**
		 * The update stream.
		 * Values will be recalculated and emitted after a throttle of 500ms.
		 * @type {Observable<T>}
		 */
		this.updateEvent = null;
	}

	/**
	 * Add items to watchlist.
	 * @param {Array<HTMLElement>} items - the collection of items to watch
	 * @return {void}
	 */
	addItemsToWatchList ( items ) {

		items.map( this.addItemToWatch );
	}

	/**
	 * Add a single item to watchlist.
	 * @param {HTMLElement} item - the html node to add
	 * @return {void}
	 */
	addItemToWatch ( item ) {

		cache.push( wrap( item ) );
	}

	/**
	 * Remove all items from watchlist.
	 * @return {void}
	 */
	clearWatchList () {

		cache.length = 0;
	}

	/**
	 * Provides read access to the cache.
	 * @return {Array<HTMLElement>} the items on the watchlist.
	 */
	getWatchList () {

		return cache.map( unWrap );
	}

	/**
	 * Initialize the stream.
	 * Will be automatically called.
	 * @private
	 * @return {InViewportService} instance
	 */
	init () {

		//eslint-disable
		this.updateEvent = Observable::from( cache )
				.merge( ScrollService.scrollEvent )
				.merge( ResizeService.resizeEvent )
				::throttleTime( INTERVAL )
				::map( checkWhichPositionsAreVisible.bind( this, cache ) );
		//eslint-enable

		refreshPositionOnLoad();

		return this;
	}
}

const instance = new InViewportService().init(); //eslint-disable-line

export default instance;
