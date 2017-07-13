

lhcss () {
    local watch='';
    if [[ "$1" == 'watch' ]]; then
        watch='--watch';
    fi

    # local iCloudDir='/Users/beingmrkenny/Library/Mobile Documents/com~apple~CloudDocs';
    local iCloudDir='/Users/beingmrkenny/iCloud';

    local input="$iCloudDir/Code/WebExtensions/ListHighlighterForTrello/scss/init.scss";
    local output="$iCloudDir/Code/WebExtensions/ListHighlighterForTrello/Extension/css/style.css";
    local loadPath="$iCloudDir/Code/WebExtensions/ListHighlighterForTrello/scss/";

    cd "$loadPath";

    sass $watch $input:$output --sourcemap=none --style=compact --load-path=$loadPath --cache=/tmp/sass-cache
}
