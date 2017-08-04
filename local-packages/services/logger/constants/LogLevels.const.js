/**
 * @typedef {Symbol} LogLevel
 */

/**
 * @type {LogLevel} - Warning level constant
 */
export const WARN = Symbol.for( 'warn' );

/**
 * @type {LogLevel} - Simple log level constant
 */
export const LOG = Symbol.for( 'log' );

/**
 * @type {LogLevel} - Info level constant
 */
export const INFO  = Symbol.for( 'info' );

/**
 * @type {LogLevel} - Error level constant
 */
export const ERROR = Symbol.for( 'error' );
