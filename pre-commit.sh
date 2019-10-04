#!/bin/bash
git diff --cached --name-only | while read FILE; do
if [[ "$FILE" =~ ^.+(js)$ ]]; then
    if [[ -f $FILE ]]; then
		if grep -q console.log "$FILE"; then
            echo -e "༼ つ ◕_◕ ༽つ console.log your code doth clog (🖕 = git commit -n)" >&2
            exit 1
        fi
    fi
fi
done || exit $?
