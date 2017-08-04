import AbstractTransport from './AbstractTransport.service';
import { WARN, LOG, INFO, ERROR } from '../constants/LogLevels.const';

/**
 * Provides an interface to console.log as output writer.
 */
class ConsoleTransport extends AbstractTransport {

	/**
	 * @param {LogLevel} logLevel
	 * @param {...object} args
	 * @override
	 */
	static out ( logLevel, ...args ) {

		switch ( logLevel ) {

			case WARN:
				console.warn( ...args ); // eslint-disable-line no-console
				break;

			case LOG:
				console.log( ...args ); // eslint-disable-line no-console
				break;

			case INFO:
				console.info( ...args ); // eslint-disable-line no-console
				break;

			case ERROR:
				console.error( ...args ); // eslint-disable-line no-console
				break;

			default:
				console.log( 'invalid logLevel', logLevel ); // eslint-disable-line no-console
				break;
		}
	}
}

export default ConsoleTransport;
