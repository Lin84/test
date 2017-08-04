import Signal from '../signal/signal';

const win = window,
      rAF = win.requestAnimationFrame ||
            win.webkitRequestAnimationFrame ||
            win.mozRequestAnimationFrame ||
            win.msRequestAnimationFrame ||
            function ( cb ) { // eslint-disable-line func-names
              return setTimeout( cb, 16 );
            };

class FasterDom {

	constructor () {
		this.debug = true;

		this._tasks = [];
		this.raf = rAF.bind( win );

		this._scheduled = false;
		this._flushing = false;
		this._currentFlush = null;

		this._currentFrame = 0;
	}

	set currentFrame ( is ) {
		this._currentFrame = is;
	}

	get currentFrame () {
		return this._currentFrame;
	}

	set isScheduled ( is ) {
		this._scheduled = is === true;
	}

	get isScheduled () {
		return this._scheduled;
	}

	set isFlushing ( is ) {
		this._flushing = is === true;
	}

	get isFlushing () {
		return this._flushing;
	}

	rafCounter () {
		const self = this;

		self.raf( ( time ) => {
			self.rafCounter();
			self._currentFrame++;
		} );
	}

	hasTasks ( frame = 0 ) {
		return typeof this._tasks[ frame ] !== 'undefined' && this._tasks[ frame ] instanceof Signal;
	}

	getTasks ( frame = 0 ) {
		if ( this.hasTasks( frame ) ) {
			return this._tasks[ frame ];
		}
		return [];
	}

	nextTasks () {
		if ( this._tasks.length > 0 ) {
			const tasks = this.getTasks();

			this._tasks.splice( 0, 1 );
			return tasks;
		}

		return new Signal();
	}

	addTask ( context, fn, frame = 0 ) {
		if ( !this.hasTasks( frame ) ) {
			this.setupFrame( frame );
		}
		this._tasks[ frame ].add( fn, context, true );
		this.scheduleTasks();

		return this;
	}

	addTaskInstant ( context, fn, frame = 0 ) {
		if ( this.isFlushing && this._currentFlush !== null && frame === 0 ) {
			this._currentFlush.add( fn, context, true );
		} else {
			if ( this.isFlushing && this._currentFlush !== null ) {
				frame -= 1; // eslint-disable-line no-param-reassign
			}
			this.addTask( context, fn, frame );
		}
		return this;
	}

	scheduleTasks () {
		const self = this;

		if ( !this.isScheduled ) {
			this.isScheduled = true;

			const checkFlush = () => {
				if ( !this.isFlushing ) {
					self.flush();
				} else {
					this.raf( checkFlush );
				}
			};

			this.raf( checkFlush );
		}
	}

	setupFrame ( frame = 0 ) {
		for ( let i = 0; i <= frame; i++ ) {
			if ( !this.hasTasks( i ) ) {
				this._tasks[ i ] = new Signal();
			}
		}
	}

	measure ( fn, frame = 0 ) {
		return this.addTask( 'reads', fn, frame );
	}

	measureInstant ( fn, frame = 0 ) {
		return this.addTaskInstant( 'reads', fn, frame );
	}

	mutate ( fn, frame = 0 ) {
		return this.addTask( 'writes', fn, frame );
	}

	mutateInstant ( fn, frame = 0 ) {
		return this.addTaskInstant( 'writes', fn, frame );
	}

	onFrame ( fn, frame = 0 ) {
		return this.addTask( 'onframe', fn, frame );
	}

	onFrameInstant ( fn, frame = 0 ) {
		return this.addTaskInstant( 'onframe', fn, frame );
	}

	clear ( frame = 0 ) {
		this.setupFrame( frame );
	}

	flush () {
		this._currentFlush = this.nextTasks();

		let error;

		this.isFlushing = true;
		this.isScheduled = false;

		try {
			this._currentFlush.dispatch( 'onframe' );
			this._currentFlush.dispatch( 'reads' );
			this._currentFlush.dispatch( 'writes' );
		} catch ( e ) {
			error = e;
		}

		this._currentFlush = null;

		if ( this._tasks.length > 0 ) {
			this.scheduleTasks();
		}

		if ( error ) {
			throw error;
		}

		this.isFlushing = false;
	}

}

class FasterDomPromised extends FasterDom {

	addTask ( context, fn, frame = 0 ) {
		if ( !this.hasTasks( frame ) ) {
			this.setupFrame( frame );
		}

		const promisedTask = this._tasks[ frame ].addPromised( fn, context, true );

		this.scheduleTasks();

		return promisedTask;
	}

	addTaskInstant ( context, fn, frame = 0 ) {
		if ( this.isFlushing && this._currentFlush !== null && frame === 0 ) {
			return this._currentFlush.addPromised( fn, context, true );
		} else {
			if ( this.isFlushing && this._currentFlush !== null ) {
				frame -= 1; // eslint-disable-line no-param-reassign
			}
			return this.addTask( context, fn, frame );
		}
	}

}

const instance = new FasterDom(); // eslint-disable-line one-var
const fasterdomPromised = new FasterDomPromised(); // eslint-disable-line one-var

export default instance;
export { fasterdomPromised };
