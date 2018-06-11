DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";

listHighlighterDir=$(jq -r .listHighlighterDir $DIR/config.json);
refreshOnWatch=$(jq -r .refreshOnWatch $DIR/config.json);
openOptionsOnRefresh=$(jq -r .openOptionsOnRefresh $DIR/config.json);
extensionKey=$(jq -r .extensionKey $DIR/config.json);
scssCompressionStyle=$(jq -r .scssCompressionStyle $DIR/config.json);

lhwatch () {
	cd $listHighlighterDir;
	lhcompile && fswatch -0xvo -l 1 "$listHighlighterDir" -e '\/css\/' -e '\/Extension\/options-page\/index\.html' -e '\.git' -e '\.scpt' -e '\.sh' | xargs -0 -n1 -I {} $listHighlighterDir/watchhandler.sh {};
}

lhrelease () {

	cd $listHighlighterDir;

	# Prepare the stuff for release
	lhcompile release;
	find "$listHighlighterDir/Extension/" -type f -name .DS_Store -exec rm {} \;

	# Copy extension to temp and duplicate it
	if [[ -d /tmp/ListHighlighter ]]; then rm -r /tmp/ListHighlighter; fi
	cp -r $listHighlighterDir/Extension /tmp/ListHighlighter;
	if [[ -f /tmp/ListHighlighter/js/debug.js ]]; then rm /tmp/ListHighlighter/js/debug.js; fi

	php -f $listHighlighterDir/processManifest.php;

	# Make the zip
	if [[ -f ~/Desktop/ListHighlighter.zip ]]; then rm ~/Desktop/ListHighlighter.zip; fi
	cd /tmp/ListHighlighter/
	zip -r ~/Desktop/ListHighlighter.zip ./

	# Display zip contents so you can check for hidden files
	unzip -vl ~/Desktop/ListHighlighter.zip

	cd $listHighlighterDir;
}

lhcompile () {

	cd $listHighlighterDir;

	local release='';
	if [[ -n $1 ]]; then
		release='release';
	fi

	lhcss;
	lhpcss;
	lhocss;

	osacompile -o $listHighlighterDir/chrome.scpt $listHighlighterDir/chrome.applescript

	php -f $listHighlighterDir/options-page-html/generateOptions.php $release;
}

lhcss () {
	local watch='';
	if [[ "$1" == 'watch' ]]; then
		watch='--watch';
	fi

	if [[ ! -d "$listHighlighterDir"/Extension/css ]]; then
		mkdir "$listHighlighterDir"/Extension/css;
	fi

	local input="$listHighlighterDir"/scss/injected/init.scss;
	local output="$listHighlighterDir"/Extension/css/style.css;
	local loadPath="$listHighlighterDir"/scss/injected;
	sass $watch "$input:$output" --sourcemap=none --style=$scssCompressionStyle --load-path="$loadPath" --cache=/tmp/sass-cache
}

lhpcss () {
	local watch='';
	if [[ "$1" == 'watch' ]]; then
		watch='--watch';
	fi

	if [[ ! -d "$listHighlighterDir"/Extension/css ]]; then
		mkdir "$listHighlighterDir"/Extension/css;
	fi

	local input="$listHighlighterDir"/scss/popup.scss;
	local output="$listHighlighterDir"/Extension/css/popup.css;
	sass $watch "$input:$output" --sourcemap=none --style=$scssCompressionStyle --cache=/tmp/sass-cache
}

lhocss () {
	local watch='';
	if [[ "$1" == 'watch' ]]; then
		watch='--watch';
	fi

	if [[ ! -d "$listHighlighterDir"/Extension/css ]]; then
		mkdir "$listHighlighterDir"/Extension/css;
	fi

	local input="$listHighlighterDir"/scss/options.scss;
	local output="$listHighlighterDir"/Extension/css/options.css;
	sass $watch "$input:$output" -I "$listHighlighterDir"/scss --sourcemap=none --style=$scssCompressionStyle --cache=/tmp/sass-cache
}
