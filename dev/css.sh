if [ "$1" == 'release' ]; then
	sourcemap="--no-source-map";
fi

rm -rf Extension/css;
mkdir -p Extension/css;
sass scss/injected/init.scss Extension/css/style.css $sourcemap;
sass scss/popup.scss Extension/css/popup.css $sourcemap;
sass scss/options.scss Extension/css/options.css $sourcemap;