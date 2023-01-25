-- osacompile -o chrome.scpt chrome.applescript

on run argv

	tell application "Google Chrome"

		if it is running then

			set chromeHasWindows to false

			set windowList to every tab of every window
			repeat with tabList in windowList
			set tabList to tabList as any
				repeat with tabItr in tabList
					set chromeHasWindows to true
				end repeat
			end repeat

			if chromeHasWindows is false
				make new window
			end if

			set trelloPages to item 1 of argv
			set optionsPage to item 2 of argv
			if (count of argv) > 2 then
				set chromeKey to item 3 of argv
			end if

			if trelloPages is "true" then

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

				if optionsPage is "true" then
					set myTab to make new tab at end of tabs of window 1
					set URL of myTab to "chrome-extension://" & chromeKey & "/options-page/index.html#Highlighting"
				end if

			end if

			if optionsPage is "true" then

				set optionsIsOpen to false
				set windowList to every tab of every window
				repeat with tabList in windowList
					set tabList to tabList as any
					repeat with theTab in tabList
						set theURL to URL of theTab
						if theURL contains "chrome-extension://" then
							set optionsIsOpen to true
						end if
					end repeat
				end repeat

				if optionsIsOpen is true
					set windowList to every tab of every window whose URL starts with "chrome-extension://"
					repeat with tabList in windowList
						set tabList to tabList as any
						repeat with tabItr in tabList
							tell tabItr to reload
						end repeat
					end repeat
				else
					set myTab to make new tab at end of tabs of window 1
					set URL of myTab to "chrome-extension://" & chromeKey & "/options-page/index.html#Highlighting"
				end if

			end if

		end if

	end tell

end run
