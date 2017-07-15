DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";
source $DIR/../config/bash.sh;

lhwatch () {
	fswatch -0xvo "$listHighlighterDir" -e css/* | xargs -0 -n1 -I {} $DIR/watchhandler.sh {};
}

lhcompile () {
	lhcss;
	lhpcss;
	lhocss;

	php -f $DIR/../php/generateOptions.php;
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
