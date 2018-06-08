<section id="CardCounting">

	<h2>List limits and card counting</h2>

	<p>Limiting the number of cards a list can contain can help you plan your workload and focus on current tasks.</p>

	<p>You can add a limit to a list by putting a number in square brackets in the list title, e.g., “<kbd>Doing&nbsp;[3]</kbd>”. To add a simple card count to a list without applying a limit, tag it <kbd class="tag">#count</kbd>.</p>

	<p>This functionality is switched off by default.</p>

	<div class="standard-options">
		<option-widget>
			<input type="checkbox" class="options-input" id="EnableWIP" name="EnableWIP">
			<label for="EnableWIP">
				Limits &amp; Card count
			</label>
		</option-widget>
		<div>
			<p>Enable list limits and card counting</p>
			<p>Default: off</p>
		</div>
	</div>

	<h2>More options</h2>

	<div class="standard-options">
		<option-widget>
			<input type="checkbox" class="options-input" id="CountAllCards" name="CountAllCards">
			<label for="CountAllCards">
				All lists
			</label>
		</option-widget>
		<div>
			<p>Count cards on all lists</p>
			<p>When this is enabled, cards will be counted on lists without needing to add the <kbd>#count</kbd> tag</p>
			<p>Default: off</p>
		</div>
	</div>

	<div class="standard-options">
		<option-widget>
			<input type="checkbox" class="options-input" id="EnablePointsOnCards" name="EnablePointsOnCards">
			<label for="EnablePointsOnCards">
				Points on cards
			</label>
		</option-widget>
		<div>
			<p>Enable manual points on cards</p>
			<p>When enabled, you can change how much a card is worth by adding a number in square brackets to the card text (you can also specify zero). Other extensions for Trello can sometimes prevent this option from working.</p>
			<p>Default: off</p>
		</div>
	</div>

	<div class="standard-options">
		<option-widget>
			<input type="checkbox" class="options-input" id="HideManualCardPoints" name="HideManualCardPoints">
			<label for="HideManualCardPoints">
				Hide card points
			</label>
		</option-widget>
		<div>
			<p>Hide points in card text</p>
			<p>If this box and “Points on cards” are checked, manual card points will be hidden.</p>
			<p><strong>⚠️ Note:</strong> this feature can interfere with other extensions for Trello that read or change card text, and vice versa. Disabling it should remove the conflict.</p>
			<p>Default: off</p>
		</div>
	</div>

</section>
