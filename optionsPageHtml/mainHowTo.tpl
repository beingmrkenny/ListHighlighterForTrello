<p class="examples">
	<span class="normal"><b>To do</b> lists stay as they are.</span>
	<span class="high"><b>Doing</b> lists are highlighted.</span>
	<span class="done"><b>Done</b> lists are greyed out.</span>
</p>

<p>
	Name your list <b>Todo</b>, <b>Doing</b>, or <b>Done</b>, and styles will be applied automatically. Or name it what you like and tag it <kbd class="tag">#todo</kbd>, <kbd class="tag">#doing</kbd>, or <kbd class="tag">#done</kbd>.
</p>

<details id="FineTuning">

	<summary data-contents="Fine Tuning, Information">Fine tuning</summary>

	<h2>Fine tuning</h2>

	{include file="./highlightingFineTuning.tpl"}

	<h2>Titles</h2>

	<p>The following titles will be recognised. Titles are not case sensitive.</p>

	<table>
		<thead>
			<tr>
				<th>Title</th>
				<th>Priority applied</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><strong>Doing</strong> or <strong>Today</strong></td>
				<td><span class="high">high</span></td>
			</tr>
			<tr>
				<td><strong>Todo</strong> or <strong>To do</strong></td>
				<td><span class="normal">normal</span></td>
			</tr>
			<tr>
				<td><strong>Done</strong> or <strong>Trash</strong></td>
				<td><span class="done">trash</span></td>
			</tr>
		</tbody>
	</table>

	<h2>Hashtags</h2>

	<table>
		<thead>
			<tr>
				<th>Tag</th>
				<th>Priority applied</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><kbd class="tag">#high</kbd>, <kbd class="tag">#today</kbd>, <kbd class="tag">#doing</kbd></td>
				<td><span class="high">high</span></td>
			</tr>
			<tr>
				<td><kbd class="tag">#normal</kbd>, <kbd class="tag">#todo</kbd>, <kbd class="tag">#to do</kbd></td>
				<td><span class="normal">normal</span></td>
			</tr>
			<tr>
				<td><kbd class="tag">#low</kbd></td>
				<td><span class="low">low</span></td>
			</tr>
			<tr>
				<td><kbd class="tag">#ignore</kbd></td>
				<td><span class="ignore">ignore</span></td>
			</tr>
			<tr>
				<td><kbd class="tag">#trash</kbd>, <kbd class="tag">#done</kbd></td>
				<td><span class="done">trash</span></td>
			</tr>
		</tbody>
	</table>

</details>
