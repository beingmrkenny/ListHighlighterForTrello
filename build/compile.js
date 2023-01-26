const { compileHTML } = require('./html');
const { compileManifest } = require('./manifest');
const exec = require('child_process').execSync;

compileHTML();
exec('sh ./build/css.sh');
compileManifest(
	(process.argv.includes('firefox') ? 'firefox dev' : '')
);