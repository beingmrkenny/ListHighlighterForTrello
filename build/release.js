const extensionName = 'ListHighlighter';

const { compileHTML } = require('./html');
const { compileManifest } = require('./manifest');
const exec = require('child_process').execSync;
const fs = require('fs-extra');
const child_process = require('child_process');

function releaseZip(forFirefox) {
	const zipFileName = forFirefox
		? `${extensionName}-Firefox.zip`
		: `${extensionName}.zip`;

	try {
		fs.emptyDirSync(`/tmp/${extensionName}`);
	} catch (err) {
		console.log(err);
	}
	try {
		fs.copySync('Extension', `/tmp/${extensionName}`);
	} catch (err) {
		console.log(err);
	}
	try {
		fs.removeSync(`${process.env.HOME}/Desktop/${zipFileName}`);
	} catch (err) {
		console.log(err);
	}

	console.log('Run these commands to check your zip for lice');
	console.log(`zip -d ~/Desktop/${zipFileName} __MACOSX/\*`);
	console.log(`unzip -vl ~/Desktop/${zipFileName}`);

	child_process.execSync(
		`zip -r ${process.env.HOME}/Desktop/${zipFileName} *`,
		{ cwd: `/tmp/${extensionName}` }
	);
}

compileHTML();
exec('sh ./build/css.sh release');

compileManifest();
releaseZip();

compileManifest('firefox release');
releaseZip(true);
