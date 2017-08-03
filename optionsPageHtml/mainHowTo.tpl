<p>
    <span class="normal"><b>To do</b> lists stay as they are.</span>
    <span class="high"><b>Doing</b> lists are highlighted.</span>
    <span class="done"><b>Done</b> lists are greyed out.</span>
</p>

<p>
    Name your list Todo, Doing, or Done, and styles will be applied automatically. Or name it what you like
    and tag it <code class="tag">#todo</code>,
    <code class="tag">#doing</code>, or <code class="tag">#done</code>.
</p>

<details>

    <summary>More information</summary>

    <h4>Priorities</h4>

    <p>
        List Highlighter uses four different list styles, based on priority:
    </p>

    <dl>
        <div>
            <dt class="high">High</dt>
            <dd>lists have a highlighted background</dd>
        </div>
        <div>
            <dt class="normal">Normal</dt>
            <dd>lists have the default appearance (no change)</dd>
        </div>
        <div>
            <dt class="low">Low</dt>
            <dd>lists are dimmed a little bit</dd>
        </div>
        <div>
            <dt class="ignore">Ignore</dt>
            <dd>lists are faded and grayed out</dd>
        </div>
    </dl>

    <h4>Titles</h4>

    <p>The following titles can be used. Titles are not case sensitive.</p>

    <table>
        <thead>
            <tr>
                <th>Title</th>
                <th>Priority applied</th>
                <th>Other effects</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Doing</strong> or <strong>Today</strong></td>
                <td><span class="high">high</span></td>
                <td>low priority applied to all untagged lists</td>
            </tr>
            <tr>
                <td><strong>Todo</strong> or <strong>To do</strong></td>
                <td><span class="normal">normal</span></td>
                <td>low priority applied to all untagged lists</td>
            </tr>
            <tr>
                <td><strong>Done</strong> or <strong>Trash</strong></td>
                <td><span class="done">ignore</span></td>
                <td><del>strikethrough</del> applied to cards on the list</td>
            </tr>
        </tbody>
    </table>

    <h4>Hashtags</h4>

    <table>
        <thead>
            <tr>
                <th>Tag</th>
                <th>Priority applied</th>
                <th>Other effects</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><code class="tag">#high</code>, <code class="tag">#today</code>, <code class="tag">#doing</code></td>
                <td><span class="high">high</span></td>
                <td>low priority applied to all untagged lists</td>
            </tr>
            <tr>
                <td><code class="tag">#normal</code>, <code class="tag">#todo</code>, <code class="tag">#to do</code></td>
                <td><span class="normal">normal</span></td>
                <td>low priority applied to all untagged lists</td>
            </tr>
            <tr>
                <td><code class="tag">#low</code></td>
                <td><span class="low">low</span></td>
                <td><i>none</i></td>
            </tr>
            <tr>
                <td><code class="tag">#ignore</code></td>
                <td><span class="ignore">ignore</span></td>
                <td><i>none</i></td>
            </tr>
            <tr>
                <td><code class="tag">#trash</code>, <code class="tag">#done</code></td>
                <td><span class="done">ignore</span></td>
                <td><del>strikethrough</del> applied to cards</td>
            </tr>
        </tbody>
    </table>

    <p><strong>Examples</strong>: &ldquo;Remaining tasks #todo&rdquo;, &ldquo;Urgent tasks #high&rdquo;, &ldquo;Backlog #low&rdquo;, &ldquo;Abandoned tasks&nbsp;#ignore&rdquo;, &ldquo;Completed tasks #done&rdquo;</p>

    <h4>Notes</h4>

    <ul>
        <li>Hashtags override titles</li>
        <li>Hashtags only appear when you are editing the title, although you can change this in Fine Tuning, below</li>
        <li>The first tag is applied and others are ignored. E.g. &ldquo;Abandoned #ignore #high&rdquo; will be highlighted as an ignore list, and the title text will appear as &ldquo;Abandoned #high&rdquo;</li>
        <li>Tags will be visible on other platforms, e.g. mobile apps and browsers without this extension installed</li>
    </ul>

</details>
