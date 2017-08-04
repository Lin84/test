//import Logger from '../logger/Log.service.js';

/**
 * Instantiates a module with a given config
 * @private
 * @param {BaseModule} Module
 * @param {moduleConfig} moduleConfig
 */
function _launch ( moduleConfig, Module ) {

	return new Module( moduleConfig ).init();
}

function _notFound ( message ) {

	//Logger.warn( message );
}

/**
 * Fetches a module from the ModuleRepository and executes it.
 * @param {ModuleRepository} ModuleRepository
 * @param {moduleConfig} moduleConfig
 * @private
 */
function _load ( ModuleRepository, moduleConfig ) {

	ModuleRepository.getModuleForIdentifier( moduleConfig )
			.then(
					_launch.bind( this, moduleConfig ),
					_notFound
			);
}

class ModuleLoader {

	/**
	 * Async fetches additional modules for components found in the DOM
	 * @param {ModuleRepository} ModuleRepository
	 * @param {Array<moduleConfig>} modules - Array containing component Identifiers
	 */
	static loadDependencies ( ModuleRepository, modules ) {

		modules.map( _load.bind( this, ModuleRepository ) );
	}
}

export default ModuleLoader;
