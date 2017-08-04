
class SignalListener {

	constructor ( fn, context, isOnce = false ) {
		this.fn      = fn;
		this.context = context;
		this.isOnce  = isOnce;
	}

	isInContext ( ctxt ) {
		return this.context === ctxt;
	}

	execute ( ...params ) {
		if ( typeof this.fn === 'function' ) {
			return this.fn( ...params );
		} else {
			return false;
		}
	}

}

class SignalListenerPromised extends SignalListener {

	constructor ( fn, context, isOnce = false ) {
		super( fn, context, isOnce );

		this.promise = new Promise( ( resolve, reject ) => {
			this.resolve = resolve;
			this.reject  = reject;
		} );
	}

	execute ( ...params ) {
		if ( typeof this.fn === 'function' ) {
			this.resolve( this.fn( ...params ) );
			return this.promise;
		} else {
			if ( typeof this.reject !== 'undefined' ) {
				return this.reject( 'Signal: Not a valid function' );
			}
			
			return false;
		}
	}

}

export default SignalListener;
export { SignalListenerPromised };
