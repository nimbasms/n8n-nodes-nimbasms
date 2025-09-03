/**
 * @type {import('@types/eslint').ESLint.ConfigData}
 */
module.exports = {
	root: true,
	env: {
		node: true,
		es6: true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2019,
		sourceType: 'module',
		project: './tsconfig.json',
		extraFileExtensions: ['.json'],
	},
	extends: [
		'eslint:recommended',
	],
	plugins: [
		'@typescript-eslint',
	],
	rules: {
		'@typescript-eslint/no-unused-vars': 'error',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/no-var-requires': 'off',
	},
	ignorePatterns: [
		'dist/**/*',
		'node_modules/**/*',
		'gulpfile.js',
		'.prettierrc.js',
		'.eslintrc.js',
		'.eslintrc.prepublish.js',
	],
}; 