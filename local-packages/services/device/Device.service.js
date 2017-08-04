import Orientation from './services/DeviceOrientation.service';
import Resize from './services/Resize.service';
import Scroll from './services/Scroll.service';
import Breakpoint from './services/Breakpoint.service';

const Device = {

	/**
	 * @type {Observable<WindowDimensions>} Observable stream publishing resize events
	 */
	resizeEvent :      Resize.resizeEvent,
	/**
	 * @type {Observable<ScrollPosition>} Observable stream publishing scroll events
	 */
	scrollEvent :      Scroll.scrollEvent,
	/**
	 * @type {Observable<Breakpoint>} Observable stream publishing breakpoint change events
	 */
	breakpointEvent :  Breakpoint.breakpointEvent,
	/**
	 * @type {Observable<DeviceOrientation>} Observable stream publishing orientation change events
	 */
	orientationEvent : Orientation.orientationEvent

};

export default Device;
export { default as OrientationService } from './services/DeviceOrientation.service';
export { default as ResizeService } from './services/Resize.service';
export { default as ScrollService } from './services/Scroll.service';
export { default as BreakpointService } from './services/Breakpoint.service';
