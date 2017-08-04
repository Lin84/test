import Device from './../Device.service';

Device.resizeEvent.subscribe( ( data ) => console.log( 'resize data', data ) );
Device.scrollEvent.subscribe( ( data ) => console.log( 'scroll data', data ) );
Device.orientationEvent.subscribe( ( data ) => console.log( 'orientation data', data ) );
