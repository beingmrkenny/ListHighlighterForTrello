DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";
source $DIR/../config/bash.sh;

lhwatch () {
	lhgo;
	fswatch -0xvo -l 1 "$listHighlighterDir" -e '\/css\/' -e '\/Extension\/options\/index\.html' -e '\.git' -e '\/sh\/' | xargs -0 -n1 -I {} $DIR/watchhandler.sh {};
}

lhgo () {
	$DIR/watchhandler.sh;
}

lhrelease () {

	cd $listHighlighterDir;

	# Prepare the stuff for release
	lhcompile release;
	find "$DIR/../Extension/" -type f -name .DS_Store -exec rm {} \;

	# Copy extension to temp and duplicate it
	if [[ -d /tmp/ListHighlighter ]]; then rm -r /tmp/ListHighlighter; fi
	cp -r $DIR/../Extension /tmp/ListHighlighter;
	if [[ -f /tmp/ListHighlighter/js/debug.js ]]; then rm /tmp/ListHighlighter/js/debug.js; fi

	php -f $DIR/processManifest.php;

	# Make the zip
	if [[ -f ~/Desktop/ListHighlighter.zip ]]; then rm ~/Desktop/ListHighlighter.zip; fi
	cd /tmp/ListHighlighter/
	zip -r ~/Desktop/ListHighlighter.zip ./

	# Display zip contents so you can check for hidden files
	unzip -vl ~/Desktop/ListHighlighter.zip

	cd $listHighlighterDir;
}

lhcompile () {

	local release='';
	if [[ -n $1 ]]; then
		release='release';
	fi

	lhcss;
	lhpcss;
	lhocss;

	osacompile -o $DIR/chrome.scpt $DIR/chrome.applescript

	php -f $DIR/../optionsPageHtml/generateOptions.php $release;
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
