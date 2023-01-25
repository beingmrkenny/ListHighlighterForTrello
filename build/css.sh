rm -rf Extension/css;
mkdir -p Extension/css;
sass scss/injected/init.scss Extension/css/style.css;
sass scss/popup.scss Extension/css/popup.css;
sass scss/options.scss Extension/css/options.css;