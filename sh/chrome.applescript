on run argv

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

			delay 0.5

			set windowList to every tab of every window whose URL starts with "https://trello.com"

			repeat with tabList in windowList
				set tabList to tabList as any
				repeat with tabItr in tabList
					tell tabItr to reload
				end repeat
			end repeat

			if item 1 of argv is "true" then
				make new window
				open location "chrome-extension://mbnamifgfdhlleidloampjacmjflaafb/options/index.html"
			end if

		end if

	end tell

end run
