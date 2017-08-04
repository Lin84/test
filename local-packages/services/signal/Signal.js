import SignalListener, { SignalListenerPromised } from './services/SignalListener.service';

class Signal {

	constructor () {
		this._listener = [];
	}

	add ( fn, context = '_', isOnce = false ) {
		const self = this;

		if ( typeof fn === 'function' ) {
			const listener = new SignalListener( fn, context, isOnce );

			self._listener.push( listener );

			return listener;
		}

		return false;
	}

	addPromised ( fn, context = '_', isOnce = false ) {
		const self = this;

		if ( typeof fn === 'function' ) {
			const listener = new SignalListenerPromised( fn, context, isOnce );

			self._listener.push( listener );

			return listener.promise;
		}

		return Promise.reject( 'Signal: not a valid function' );
	}

	getListener ( context = '_' ) {
		if ( context === '_' ) {
			return this._listener;
		}

		return this._listener.filter( ( l, idx, arr ) => {
			return l.isInContext( context );
		} );
	}

	dispatch ( context = '_', ...params ) {
		const self = this,
		      toRemove = [];
		
		for ( let i = 0; i < this._listener.length; i++ ) {
			const l = this._listener[ i ];

			if ( l.isInContext( context ) ) {
				l.execute( ...params );
				if ( l.isOnce ) {
					toRemove.push( l );
				}
			}
		}

		toRemove.map( ( v ) => {
			self._listener.splice( self._listener.indexOf( v ), 1 );
			return v;
		} );
	}

	dispatchPromised ( context = '_', ...params ) {
		const self = this;

		return Promise.all( self.getListener( context ).map( ( l ) => {
			if ( typeof l.promise !== 'undefined' ) {
				return l.execute( ...params );
			} else {
				return Promise.resolve( l.execute( ...params ) );
			}
		} ) );
	}

	clear () {
		this._listener = [];
	}

}

export default Signal;
