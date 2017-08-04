# Log.service

- Provides a logging abstraction from the default 'console.log', which is forbidden by ESLint settings.
- Provides a frontend-to-backend logging transport

## Installation

### From npm

**Attention: currently not published yet**

```bash
npm i -s frontend-logger

```

### Install from local fs

**Attention: To use this the package folder must me placed inside the project, eg: 'local-packages'**

```bash
npm i -s file:{{realtive-path-to-foilder-containing-package}}

```

## Requirements

A backend api endpoint receiving POST requests in JSON format.

## Default export

A static class, providing static methods for different logging levels:

- log
- info
- warn
- error

```javascript

class Logger {

	/**
	 * @public
	 * @param {...object} args
	 */
	static log ( ...args ) {
		write( LOG, ...args );
	}

	/**
	 * @public
	 * @param {...object} args
	 */
	static info ( ...args ) {
		write( INFO, ...args );
	}

	/**
	 * @public
	 * @param {...object} args
	 */
	static warn ( ...args ) {
		write( WARN, ...args );
	}

	/**
	 * @public
	 * @param {...object} args
	 */
	static error ( ...args ) {
		write( ERROR, ...args );
	}
}

export default Logger;

```

The logger uses console- and backend-transports depending on the build environment:

### Development
- ConsoleTransport

### Staging
- ConsoleTransport
- FileTransport

### Production
- FileTransport

## Usage

### import default

```javascript
import Logger from 'frontend-logger';

Logger.log('message');
Logger.info('message');
Logger.warn('message');
Logger.error('message');
```

### import sub-services

```javascript
import FileTransport from 'frontend-logger/services/FileTransport.service';
```

This is useful and necessary to override the default server logging api path via:

```javascript
FileTransport.setPath('your-api-path');
```