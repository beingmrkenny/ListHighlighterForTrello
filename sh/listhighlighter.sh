DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";
source $DIR/../config/bash.sh;

lhwatch () {
	lhgo;
	fswatch -0xv -l 1 "$listHighlighterDir" -e /css/ -e /options/index.html -e .git -e /sh/ | xargs -0 -n1 -I {} $DIR/watchhandler.sh {};
}

lhgo () {
	$DIR/watchhandler.sh;
}

lhrelease () {

	# Prepare the stuff for release
	lhcompile;
	find "$DIR/../Extension/" -type f -name .DS_Store -exec rm {} \;

	# Copy extension to temp and duplicate it
	if [[ -d /tmp/ListHighlighter ]];        then rm -r /tmp/ListHighlighter;        fi
	if [[ -d /tmp/ListHighlighterFirefox ]]; then rm -r /tmp/ListHighlighterFirefox; fi
	cp -r $DIR/../Extension /tmp/ListHighlighter;
	if [[ -f /tmp/ListHighlighter/js/debug.js ]]; then rm /tmp/ListHighlighter/js/debug.js; fi
	cp -r /tmp/ListHighlighter /tmp/ListHighlighterFirefox;
	rm /tmp/ListHighlighter/firefoxApplications.json;

	# Process the manifest for firefox
	php -f $DIR/processManifest.php;
	rm /tmp/ListHighlighterFirefox/firefoxApplications.json;

	# Make the zips
	if [[ -f ~/Desktop/ListHighlighter.zip ]];        then rm ~/Desktop/ListHighlighter.zip;        fi
	if [[ -f ~/Desktop/ListHighlighterFirefox.zip ]]; then rm ~/Desktop/ListHighlighterFirefox.zip; fi
	cd /tmp/ListHighlighter/
	zip -r ~/Desktop/ListHighlighter.zip ./
	cd /tmp/ListHighlighterFirefox/
	zip -r ~/Desktop/ListHighlighterFirefox.zip ./

	# Check the zips for dirty horrible hidden files
	unzip -vl ~/Desktop/ListHighlighter.zip
	unzip -vl ~/Desktop/ListHighlighterFirefox.zip
	# zip -d ~/Desktop/ListHighlighter.zip __MACOSX/\*
	# zip -d ~/Desktop/ListHighlighterFirefox.zip __MACOSX/\*
}

lhcompile () {
	lhcss;
	lhpcss;
	lhocss;

	osacompile -o $DIR/chrome.scpt $DIR/chrome.applescript

	php -f $DIR/../optionsPageHtml/generateOptions.php;
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
	sass $watch "$input:$output" --sourcemap=none --style=compressed --load-path="$loadPath" --cache=/tmp/sass-cache
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
	sass $watch "$input:$output" --sourcemap=none --style=compressed --cache=/tmp/sass-cache
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
	sass $watch "$input:$output" -I "$listHighlighterDir"/scss --sourcemap=none --style=compressed --cache=/tmp/sass-cache
}
