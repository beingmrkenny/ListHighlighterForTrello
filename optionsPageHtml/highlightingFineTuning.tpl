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
        Currently, &ldquo;<strong>Thursday tasks #todo</strong>&rdquo; will appear as &ldquo;<strong>Thursday tasks<text-switcher id="HideHashtagsSwitcher" data-on="" data-off=" #todo"></text-switcher></strong>&rdquo;
    </small>
</label>

<label for="HighlightTitles">
    <input type="checkbox" class="option-control options-input" id="HighlightTitles" name="HighlightTitles">
    Highlight lists based on title text<br>
    <small>(e.g. highlight list if title <text-switcher id="HighlightTitlesSwitcher" data-on="contains the text" data-off="is exactly">is exactly</text-switcher> &ldquo;<strong>Todo</strong>&rdquo;, &ldquo;<strong>Doing</strong>&rdquo;, &ldquo;<strong>Done</strong>&rdquo;, etc)</small>
</label>
<label for="MatchTitleSubstrings" class="sub-setting">
    <input type="checkbox" class="option-control options-input" id="MatchTitleSubstrings" name="MatchTitleSubstrings">
    Match partial title text<br>
    <small>
        Highlight lists if the title contains one of the keywords. E.g.<br>
        &ldquo;<strong>To do</strong>&rdquo; will always be matched<br>
        &ldquo;<strong>Things to do</strong>&rdquo; <text-switcher id="MatchTitleSubstringsSwitcher" data-off="will not" data-on="will also">will not</text-switcher> be matched
    </small>
</label>
