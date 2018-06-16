<section id="Dimming">

	<h2>Un-dim dimmed lists on hover</h2>

	<div class="standard-options">
		<option-widget>
			<input type="checkbox" class="options-input" id="UndimOnHover" name="UndimOnHover">
			<label for="UndimOnHover">
				Un-dim on hover
			</label>
		</option-widget>
		<div>
			<p>Make dimmed lists easier to read by un-dimming them when you mouse over them</p>
			<p>Default: on</p>
		</div>
	</div>

	<h2>Dimming untagged lists</h2>

	<p>When you add a high priority (e.g. Doing) or a normal priority (e.g. Todo) list to a board, List Highlighter can automatically dim untagged lists in order to create better contrast. You can change these settings below.</p>

	<div class="standard-options">
		<option-widget>
			<input type="checkbox" class="options-input" id="DimUntaggedNormal" name="DimUntaggedNormal">
			<label for="DimUntaggedNormal">
				Normal
			</label>
		</option-widget>
		<div>
			<p>Dim untagged lists on boards with normal priority lists (recommended)</p>
			<p>Default: on</p>
		</div>
	</div>

	<div class="standard-options">
		<option-widget>
			<input type="checkbox" class="options-input" id="DimUntaggedHigh" name="DimUntaggedHigh">
			<label for="DimUntaggedHigh">
				High
			</label>
		</option-widget>
		<div>
			<p>Dim untagged lists on boards with high priority lists</p>
			<p>Default: off</p>
		</div>
	</div>

	<h2>Custom dimming</h2>

	<p>Here you can change how much dimming List Highlighter applies to lists. The default for low priority lists is 45%, while the default for done/ignore/trash lists is 25%.</p>

	<div id="DimmingExampleBoard">
		<label for="DimmingLow" class="dimming-input-block">
			<span>Low priority</span>
			<input name="DimmingLow" id="DimmingLow" type="range" class="opacity-range options-input" min="0" max="1" step="0.01">
			<span data-value-label-for="DimmingLow"></span>
		</label>

		<label for="DimmingDone" class="dimming-input-block">
			<span>Done/Ignore/Trash</span>
			<input name="DimmingDone" id="DimmingDone" type="range" class="opacity-range options-input" min="0" max="1" step="0.01">
			<span data-value-label-for="DimmingDone"></span>
		</label>

		<div class="dimming-example-lists">
			<div class="dimming-example-list">
				<p class="dimming-example-list-header">Normal</p>
				<p class="dimming-example-list-card">Lorem ipsum dolor sit amet.</p>
				<p class="dimming-example-list-card">Vivamus id ipsum faucibus, maximus tellus a, placerat urna consequat.</p>
				<p class="dimming-example-list-card">Etiam volutpat sapien at eleifend dignissim consectetur adipiscing elit.</p>
				<p class="dimming-example-list-card">Phasellus placerat mauris quis mi ultricies efficitur.</p>
				<p class="dimming-example-add-card">Add card&hellip;</p>
			</div>

			<div class="dimming-example-list" id="DimmingLowExample">
				<p class="dimming-example-list-header">Low priority</p>
				<p class="dimming-example-list-card">Sit amet sapien feugiat, vestibulum ipsum in, congue leo.</p>
				<p class="dimming-example-list-card">Aliquam egestas orci at dui.</p>
				<p class="dimming-example-list-card">Sed maximus massa sed augue condimentum blandit.</p>
				<p class="dimming-example-list-card">Vivamus quis metus lacinia ante.</p>
				<p class="dimming-example-list-card">Cras dapibus massa eu magna porta placerat.</p>
				<p class="dimming-example-add-card">Add card&hellip;</p>
			</div>

			<div class="dimming-example-list" id="DimmingDoneExample">
				<p class="dimming-example-list-header">Done / Ignore / Trash</p>
				<p class="dimming-example-list-card">Vivamus quis metus lacinia ante auctor malesuada eu quis metus.</p>
				<p class="dimming-example-list-card">Duis sed neque sollicitudin, sagittis purus a, suscipit felis hendrerit.</p>
				<p class="dimming-example-list-card">Nunc vitae odio quis nunc.</p>
				<p class="dimming-example-list-card">Id massa dignissim, varius nisi nec, pharetra lorem.</p>
				<p class="dimming-example-list-card">Pellentesque vel mi ut felis euismod.</p>
				<p class="dimming-example-add-card">Add card&hellip;</p>
			</div>
		</div>

	</div>

</section>
