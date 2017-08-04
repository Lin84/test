import AbstractTransport from './AbstractTransport.service';
import PATH from './../constants/Paths.const';
import request from 'superagent';

/**
 * Post error messages to server-side handler
 */
class FileTransport extends AbstractTransport {

	/**
	 * Override the default path.
	 * @param {string} path to backend logging api
	 */
	static setPath ( path ) {
		FileTransport.path = path;
	}

	/**
	 * @override
	 * @param {LogLevel} logLevel
	 * @param {...object} args
	 */
	static out ( logLevel, ...args ) {

		request
				.post( FileTransport.path || PATH )
				.send(
						/**
						 * @typedef {object} LogParams
						 * @property {string} level
						 * @property {string} message
						 */
						{
							level :   Symbol.keyFor( logLevel ),
							message : JSON.stringify( args )
						} );
	}
}

export default FileTransport;
