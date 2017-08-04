# Device.service

Provides an interface to the following sub-services:

- Breakpoint.service
- DeviceOrientation.service
- Resize.service
- Scroll.service
- Viewport.service

Those are providing global device streams for the respective events, to which you can subscribe to.

## Installation

### From npm

**Attention: currently not published yet**

```bash
npm i -s device

```

### Install from local fs

**Attention: To use this the package folder must me placed inside the project, eg: 'local-packages'**

```bash
npm i -s file:{{realtive-path-to-foilder-containing-package}}

```

## Default export

The default export exports a singleton object containing the following streams

```javascript
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
```

### Usage

```javascript
import Device from 'device';

Device.resizeEvent.subscribe( resizeCallback );
Device.scrollEvent.subscribe( scrollCallback );
Device.breakpointEvent.subscribe( breakpointCallback );
Device.orientationEvent.subscribe( orientationCallback );
```

## Sub-service exports

```javascript
export { default as OrientationService } from './services/DeviceOrientation.service';
export { default as ResizeService } from './services/Resize.service';
export { default as ScrollService } from './services/Scroll.service';
export { default as BreakpointService } from './services/Breakpoint.service';
```

### Usage

To import all sub-services for example:

```javascript
import { OrientationService, ResizeService, ScrollService, BreakpointService } from 'device';
```