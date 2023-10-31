const { compileHTML } = require('./html');
const { compileManifest } = require('./manifest');
const exec = require('child_process').execSync;

compileHTML();
exec('sh ./build/css.sh');

let args = ['dev'];

if (process.argv.includes('firefox')) {
	args.push('firefox');
}

compileManifest(args.join(' '));
