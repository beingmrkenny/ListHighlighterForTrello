{function input inputName='' type='' value='' label='' exclude=""}
	{if $type == 'checkbox'}
		{assign var="id" value=$inputName}
	{elseif $type == 'radio'}
		{assign var="id" value=getInputId($inputName, $value)}
	{/if}
	{if $label == ""}
		{assign var="label" value="$value"}
	{/if}
	<rules-option>
		<input type="{$type}" name="{$inputName}" id="{$id}"
			{if $value}value="{$value}"{/if}
			{if $exclude} data-exclude="{$exclude}"{/if}>
		<label for="{$id}">{$label}</label>
	</rules-option>
{/function}

<section id="Rules">

	<option-widget>
		<input type="checkbox" name="HideHashTags" id="HideHashTags">
		<label for="HideHashTags">Hide hashtags</label>
	</option-widget>

	<h2>Rules</h2>

	<table>
		<tr>
			{assign var="r" value="1"}

			<td class="options-list-title">
				<h3>List title</h3>
				<p>
					is:<br>
					<textarea></textarea>
				</p>
				<p>
					contains:<br>
					<textarea></textarea>
				</p>
				<p class="small">
					Separate terms with a new line
				</p>
			</td>

			<td class="options-treatments">

				<h3>Style lists</h3>

				<div class="option-group">
					<p>
						{input inputName=getInputName('Highlight', $r) type="checkbox" value='highlight' label='highlight it' exclude="highlight"}
					</p>
					<ul class="sub-option">
						<li>{input inputName='HighlightOption' type="radio" value='highlightColor' label='use highlight colour'}</li>
						<li>{input inputName='HighlightOption' type="radio" value='useCustom' label='use custom'}</li>
					</ul>
				</div>

				<div class="option-group">
					<p>
						{input inputName=getInputName('Grayscale', $r) type="checkbox" value='grayscale' label='grey it out' exclude="highlight"}
					</p>
				</div>

				<div class="option-group">
					<p>
						{input inputName=getInputName('DimIt', $r) type='checkbox' label='dim it'}
						<range-input class="sub-option">
							{assign var="name" value=getInputName('DimLevel', $r)}
							<label for="{$name}">less more</label>
							<input name="{$name}" id="{$name}" type="range" min="0" max="1" step="0.01">
						</range-input>
					</p>
				</div>

				<div class="option-group">
					{input inputName=getInputName('DimUntagged', $r) type="checkbox" label='dim untagged lists on same board'}
					<range-input class="sub-option">
						{assign var="name" value=getInputName('DimUntagged', $r)}
						<label for="{$name}">less more</label>
						<input name="{$name}" id="{$name}" type="range" min="0" max="1" step="0.01">
					</range-input>
				</div>

				<div class="option-group">
					<h3>Format text on cards</h3>
					<ul>
						<li>
							{input inputName=getInputName('Strikethrough', $r) type="checkbox" label='strikethrough'}
						</li>
						<li>
							{input inputName=getInputName('Bold', $r) type="checkbox" label='bold'}
						</li>
						<li>
							{input inputName=getInputName('Italic', $r) type="checkbox" label='italic'}
						</li>
					</ul>
				</div>

			</td>

			<td class="options-on-off">
				<option-widget>
					<input type="checkbox" name="Rule-`$r`" id="Rule-`$r`">
					<label for="Rule-`$r`"></label>
				</option-widget>
				<p>
					<br>
					<a href="#">Delete</a>
				</p>
			</td>

		</tr>
	</table>

	{*


    Dim - 4 levels
		- displayed as squares

	Error messages — if a text snippet is reused

	Rules

	TODO is it time to drop the {} format?

	#low
		{low}

	todo
	to do
	#todo
	#to do
	#normal
		{normal}
		{todo}
		{to do}

	doing
	today
	#today
	#doing
	#high
		{high}
		{today}
		{doing}

	trash
	done
	#trash
	#done
		{trash}
		{done}

	#ignore
		{ignore}

    *}

</section>
