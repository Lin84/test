import ResizeService from './Resize.service';
import { KEYS } from './../constants/Breakpoints.const';
import Breakpoint from './../entities/Breakpoint.entity';
import { BREAKPOINT_DEFINITION } from './../constants/Breakpoints.const';
import { pairwise } from 'rxjs/operator/pairwise';
import { filter } from 'rxjs/operator/filter';
import { map } from 'rxjs/operator/map';
import { startWith } from 'rxjs/operator/startWith';

/**
 *
 * @type {Array<Breakpoint>}
 */
const Breakpoints = [];

/**
 * Register a given breakpoint definition consisting of:
 * @private
 * @param {string} key - the breakpoint alias
 * @param {int} min - min width of breakpoint
 * @param {int} max - max width of breakpoint
 * @returns {void}
 */
function register ( key, min, max ) {

	const breakPoint = new Breakpoint( key, min, max );

	Breakpoints.push( breakPoint );
}

/**
 * Read breakpoint definitons from config file and register them for matching.
 * @param {Object} styleConfig - JSON format
 * @returns {void}
 */
function setupBreakpoints ( styleConfig ) {

	const breakPointDefinition = styleConfig [ BREAKPOINT_DEFINITION ];

	for ( const alias in breakPointDefinition ) {

		if ( breakPointDefinition.hasOwnProperty( alias ) ) {

			register(
					breakPointDefinition[ alias ][ KEYS.NAME ],
					breakPointDefinition[ alias ][ KEYS.MIN ],
					breakPointDefinition[ alias ][ KEYS.MAX ]
			);
		}
	}
}

/**
 * @private
 * @param {Breakpoint} breakPoint - breakpoint instance
 * @param {int} width - current viewport width
 * @returns {boolean|T} - whether the current width is in range of the breakpoint
 */
function isInRange ( breakPoint, width ) {

	return breakPoint.min <= width && breakPoint.max >= width;
}

/**
 * Find the current matching breakpoint in the registered breakpoints.
 * @private
 * @param {int} width - the current viewport width
 * @returns {Breakpoint} - the breakpoint which is currently active
 */
function calcBreakpoint ( width ) {

	/**
	 * @returns {Breakpoint}
	 */
	return Breakpoints.find( ( breakPoint ) => isInRange( breakPoint, width ) );
}

/**
 * Only dispatch if the new breakpoint is different to the last one.
 * @param events
 * @return {boolean}
 */
function detectBreakpointChange ( events ) {

	return calcBreakpoint( events[ 0 ].width ) !== calcBreakpoint( events[ 1 ].width );
}

/**
 *
 * @param events
 * @return {Breakpoint}
 */
function getCurrentBreakpoint ( events ) {

	return calcBreakpoint( events[ 1 ].width );
}

/**
 * @public
 * @returns {Observable<TBreakpoint>} - event stream for breakpoint events
 */
function registerBreakpointEvent () {

	/*eslint-disable */
	return ResizeService.resizeEvent
			::startWith( ResizeService.getCurrent )
			::pairwise()
			::filter( detectBreakpointChange )
			::map( getCurrentBreakpoint );
	/*eslint-enable */
}

const BreakpointService = {

	/**
	 * Inject breakpoint defintions as dependency
	 * @public
	 */
	use : setupBreakpoints,

	/**
	 * Event stream for resize events
	 * @public
	 */
	breakpointEvent : registerBreakpointEvent(),

	/**
	 * Get all registered breakpoints
	 * @returns {Array<Breakpoint>} - an array containg all registered breakpoints
	 * @public
	 */
	getBreakpoints () {
		return Breakpoints;
	}
};

export default BreakpointService;
