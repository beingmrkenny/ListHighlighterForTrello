<label for="HighlightTags">
    <input type="checkbox" class="option-control options-input" id="HighlightTags" name="HighlightTags">
    Highlight lists based on hashtags<br>
    <small>(e.g. highlight list if title is tagged <strong>#todo</strong>, <strong>#doing</strong>, <strong>#done</strong>, etc)</small>
</label>
<label for="HideHashtags" class="sub-setting">
    <input type="checkbox" class="option-control options-input" id="HideHashtags" name="HideHashtags">
    Hide hashtags in list headers<br>
    <small>
        If this box and the one above are checked, hashtags in list headers will be hidden.<br>
        Currently, "<strong>Thursday tasks #todo</strong>" will appear as "<strong>Thursday tasks<text-switcher id="HideHashtagsSwitcher" data-on="" data-off=" #todo"></text-switcher></strong>"
    </small>
</label>

<label for="HighlightTitles">
    <input type="checkbox" class="option-control options-input" id="HighlightTitles" name="HighlightTitles">
    Highlight lists based on title text<br>
    <small>(e.g. highlight list if title <text-switcher id="HighlightTitlesSwitcher" data-on="contains the text" data-off="is exactly">is exactly</text-switcher> "<strong>Todo</strong>", "<strong>Doing</strong>", "<strong>Done</strong>", etc)</small>
</label>
<label for="MatchTitleSubstrings" class="sub-setting">
    <input type="checkbox" class="option-control options-input" id="MatchTitleSubstrings" name="MatchTitleSubstrings">
    Match partial title text<br>
    <small>
        Currently:<br>
        "<strong>To do</strong>" will be matched<br>
        "<strong>Things to do</strong>" <text-switcher id="MatchTitleSubstringsSwitcher" data-off="will not" data-on="will">will not</text-switcher> be matched
    </small>
</label>
