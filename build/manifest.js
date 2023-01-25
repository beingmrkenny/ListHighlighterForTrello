// npm run manifest firefox dev (v2; applications)
// npm run manifest firefox release (v2)
// npm run manifest (v3; no additions)

const forFirefox = (process.argv.includes('fx') || process.argv.includes('firefox'));
const forDev = process.argv.includes('dev');
const forRelease = process.argv.includes('release');

if (forDev && forRelease) {
	console.log("Can't use 'dev' and 'release' at the same time if running manifest");
	return false;
}

if (forFirefox && (!forDev && !forRelease)) {
	console.log("Must specify 'dev' or 'release' if running manifest for Firefox");
	return false;
}

const fs = require('fs');

const useVersion = forFirefox ? '2' : '3';
const deleteVersion = forFirefox ? '3' : '2';
const includeApplications = (forFirefox && forDev);

const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));

manifest.manifest_version = useVersion;

if (!includeApplications) {
	delete(manifest.applications);
}

const useKey = `v${useVersion}`;
delete (manifest[`v${deleteVersion}`]);
for (const key in manifest[useKey]) {
	manifest[key] = manifest[useKey][key];
}
delete (manifest[useKey]);

try { fs.unlinkSync('Extension/manifest.json'); } catch (e) { }
fs.writeFileSync('Extension/manifest.json', JSON.stringify(manifest, null, 2));