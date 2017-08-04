import {Observable} from 'rxjs/Observable';
import {fromEvent} from 'rxjs/observable/fromEvent';
import {mergeMap} from 'rxjs/operator/mergeMap';
import Orientations from './../entities/DeviceOrientation.entity';

import { fasterdomPromised as fasterdom } from '../../fasterdom/fasterdom';

const Events = {
	      ROTATE : 'orientationchange'
      };

/**
 * @typedef {object} DeviceOrientation
 * @property {DeviceOrientationValue} rotation
 */

/**
 * Factory function for orientation object.
 * @returns {DeviceOrientation} - the current orientation
 */
function properties () {

	return {
		rotation : null
	};
}

/**
 * Determine the current orientation
 * @returns {DeviceOrientation} - the current orientation
 */
function calcOrientation () {

	return fasterdom.measure( () => {

		const props = properties();

		props.rotation = window[ 'orientation' ] === 90 || window[ 'orientation' ] === -90 ? //eslint-disable-line dot-notation
		                 Orientations.LANDSCAPE :
		                 Orientations.PORTRAIT;

		return props;
	} );
}

/**
 *
 * @public
 * @returns {Observable<TResult>} - event stream for orientation change events
 */
function registerOrientationChangeEvent () {

	return Observable
			::fromEvent( window, Events.ROTATE )
			::mergeMap( calcOrientation );
}

const DeviceOrientationService = {

	orientationEvent : registerOrientationChangeEvent(),

	getOrientations () {
		return Orientations;
	}
};

export default DeviceOrientationService;
