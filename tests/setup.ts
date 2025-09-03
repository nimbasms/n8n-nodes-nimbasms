// Setup Jest environnement pour les tests
global.console = {
	...console,
	// Masquer les logs pendant les tests sauf si VERBOSE=true
	log: process.env.VERBOSE ? console.log : jest.fn(),
	warn: process.env.VERBOSE ? console.warn : jest.fn(),
	error: process.env.VERBOSE ? console.error : jest.fn(),
	info: process.env.VERBOSE ? console.info : jest.fn(),
	debug: process.env.VERBOSE ? console.debug : jest.fn(),
}; 