<p>
    <span class="normal"><b>To do</b> lists stay as they are.</span>
    <span class="high"><b>Doing</b> lists are highlighted.</span>
    <span class="done"><b>Done</b> lists are greyed out.</span>
</p>

<p>
    Name your list Todo, Doing, or Done, and styles will be applied automatically. Or name it what you like
    and tag it <kbd class="tag">#todo</kbd>,
    <kbd class="tag">#doing</kbd>, or <kbd class="tag">#done</kbd>.
</p>

<details>

    <summary data-contents="Settings, Information">More</summary>

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
                <td><kbd class="tag">#high</kbd>, <kbd class="tag">#today</kbd>, <kbd class="tag">#doing</kbd></td>
                <td><span class="high">high</span></td>
                <td>low priority applied to all untagged lists</td>
            </tr>
            <tr>
                <td><kbd class="tag">#normal</kbd>, <kbd class="tag">#todo</kbd>, <kbd class="tag">#to do</kbd></td>
                <td><span class="normal">normal</span></td>
                <td>low priority applied to all untagged lists</td>
            </tr>
            <tr>
                <td><kbd class="tag">#low</kbd></td>
                <td><span class="low">low</span></td>
                <td><i>none</i></td>
            </tr>
            <tr>
                <td><kbd class="tag">#ignore</kbd></td>
                <td><span class="ignore">ignore</span></td>
                <td><i>none</i></td>
            </tr>
            <tr>
                <td><kbd class="tag">#trash</kbd>, <kbd class="tag">#done</kbd></td>
                <td><span class="done">ignore</span></td>
                <td><del>strikethrough</del> applied to cards</td>
            </tr>
        </tbody>
    </table>

    <h5>E.g.</h5>
    <ul>
        <li><kbd>Remaining tasks #todo</kbd></li>
        <li><kbd>Urgent tasks #high</kbd></li>
        <li><kbd>Backlog #low</kbd></li>
        <li><kbd>Abandoned tasks #ignore</kbd></li>
        <li><kbd>Completed tasks #done</kbd></li>
    </ul>

    <h4>Notes</h4>

    <ul>
        <li>Hashtags override titles</li>
        <li>Hashtags only appear when you are editing the title, although you can change this in fine tuning below</li>
        <li>Only the first tag is applied. E.g. &ldquo;<kbd>Abandoned #ignore #high</kbd>&rdquo; will be highlighted as an ignore list, and the title text will appear as &ldquo;Abandoned #high&rdquo;</li>
        <li>Tags will be visible on other platforms, e.g. mobile apps and browsers without this extension installed</li>
    </ul>

    <h4>Fine tuning</h4>

    {include file="./highlightingFineTuning.tpl"}

</details>
