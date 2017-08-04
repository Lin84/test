/**
 *
 * @typedef {object} ModuleLoaderConfig
 * @property {string} SELECTOR
 * @property {string} ATTRIBUTE
 * @property {string} CONFIG_ATTRIBUTE
 */

export default {
	/**
	 * @type ModuleLoaderConfig
	 */
	MODULES : {
		SELECTOR :         '[data-module]',
		ATTRIBUTE :        'data-module',
		CONFIG_ATTRIBUTE : 'data-module-config'
	},
	/**
	 * @type ModuleLoaderConfig
	 */
	TABLES : {
		SELECTOR :         '.table',
		ATTRIBUTE :        'class',
		CONFIG_ATTRIBUTE : 'data-class-config'
	}
};