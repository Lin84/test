/**
 * Base class providing the interface
 * @abstract
 */
class AbstractTransport {

	/**
	 * @abstract
	 * @param {LogLevel} logLevel
	 * @param {...object} args
	 */
	static out ( logLevel, ...args ) {}
}

export default AbstractTransport;
