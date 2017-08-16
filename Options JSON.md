# Options JSON object structure

## Version 3

	{

		"colorBlindFriendlyMode" : null|<boolean>,

		"colors" : {

			"current" : {
				"blue"    : null|colorName|"custom",
				"default" : null|colorName|"custom",
				"gray"    : null|colorName|"custom",
				"green"   : null|colorName|"custom",
				"lime"    : null|colorName|"custom",
				"orange"  : null|colorName|"custom",
				"pink"    : null|colorName|"custom",
				"purple"  : null|colorName|"custom",
				"red"     : null|colorName|"custom",
				"sky"     : null|colorName|"custom"
			},

			"custom" : {
				"blue"    : null|colorHex,
				"default" : null|colorHex,
				"gray"    : null|colorHex,
				"green"   : null|colorHex,
				"lime"    : null|colorHex,
				"orange"  : null|colorHex,
				"pink"    : null|colorHex,
				"purple"  : null|colorHex,
				"red"     : null|colorHex,
				"sky"     : null|colorHex
			}

		},

		"options" : {
			"EnableHeaderCards"    : <boolean>,
			"EnableSeparatorCards" : <boolean>,
			"EnableWIP"            : <boolean>,
			"HideHashtags"         : <boolean>,
			"HighlightTags"        : <boolean>,
			"HighlightTitles"      : <boolean>,
			"MatchTitleSubstrings" : <boolean>
		}

	}
