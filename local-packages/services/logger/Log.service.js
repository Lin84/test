import ConsoleTransport from './services/ConsoleTransport.service';
import FileTransport from './services/FileTransport.service';
import { WARN, LOG, INFO, ERROR } from './constants/LogLevels.const';

/**
 * @private
 * @param {LogLevel} logLevel the severity level
 * @param {...object} args parameter list
 * @return {void}
 */
function write ( logLevel, ...args ) {

	switch ( 'production' ) {

		case 'production':
			//FileTransport.out( logLevel, ...args );
			break;

		case 'staging':
			FileTransport.out( logLevel, ...args );
			ConsoleTransport.out( logLevel, ...args );
			break;

		default:
			ConsoleTransport.out( logLevel, ...args );
			break;
	}
}

/**
 * Provides a logging abstraction independant of console log.
 * Can use multiple transports.
 * Logs depending on current environment:
 *
 * development: console only
 * staging: console and filesystem
 * production: filesystem only
 */
class Logger {

	/**
	 * Log
	 * @public
	 * @param {...object} args parameter list
	 * @return {void}
	 */
	static log ( ...args ) {
		write( LOG, ...args );
	}

	/**
	 * Info
	 * @public
	 * @param {...object} args parameter list
	 * @return {void}
	 */
	static info ( ...args ) {
		write( INFO, ...args );
	}

	/**
	 * Warn
	 * @public
	 * @param {...object} args parameter list
	 * @return {void}
	 */
	static warn ( ...args ) {
		write( WARN, ...args );
	}

	/**
	 * Error
	 * @public
	 * @param {...object} args parameter list
	 * @return {void}
	 */
	static error ( ...args ) {
		write( ERROR, ...args );
	}
}

export default Logger;

export { WARN, LOG, INFO, ERROR } from './constants/LogLevels.const';
