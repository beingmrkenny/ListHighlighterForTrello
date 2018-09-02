LHDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";

source $LHDIR/listhighlighter.sh;

lhcompile;

command -v terminal-notifier >/dev/null 2>&1;
if [[ "$?" == 0 ]]; then
	# To get notified on macOS when this runs, install the terminal-notifier gem for ruby:
	# sudo gem install terminal-notifier
	terminal-notifier -title "File watch completed" -message "List Highlighter for Trello" -timeout 1
fi
