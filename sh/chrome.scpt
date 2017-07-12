tell application "Google Chrome"

    if it is running then

        open location "http://reload.extensions"

        delay 1

        set windowList to every tab of every window whose URL starts with "http://reload.extensions"

    	repeat with tabList in windowList
    		set tabList to tabList as any
    		repeat with tabItr in tabList
    			set tabItr to tabItr as any
    			delete tabItr
    		end repeat
    	end repeat

        delay 1

        set windowList to every tab of every window whose URL starts with "https://trello.com"

    	repeat with tabList in windowList
    		set tabList to tabList as any
    		repeat with tabItr in tabList
    			tell tabItr to reload
    		end repeat
    	end repeat

    end if

end tell
