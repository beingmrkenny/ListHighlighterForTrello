var watchers = {

	body : {
		targets: document.body,
		observer : new MutationObserver(System.handleBodyAttributeChanges),
		options : {childList: false, subtree: false, attributes: true, attributeOldValue: true}
	},

	title : {
		targets : document.querySelector('title'),
		observer : new MutationObserver(function (mr) {
			console.log('process page on title change');
			System.processPageOnTitleChange(mr);
		}),
		options : {characterData: true, childList: true, subtree: false}
	},

	board : {
		targetsSet : document.getElementById('board'),
		observer: new MutationObserver(function (mr) {
			console.log('board changed - check for new lists');
			System.checkForNewLists(mr);
		}),
		options : {childList: true, subtree: false}
	},

	// FIXME This is called 4 times when dragging
	// mutation observers are cumulative
	list : {
		targets : document.querySelectorAll('.list-cards'),
		observer: new MutationObserver(function (mr) {
			console.log('check for new cards');
			System.checkForNewCards(mr);
		}),
		options : {childList: true, subtree: false}
	},

	listTitle : {
		targets : document.querySelectorAll('.list-header h2'),
		observer : new MutationObserver(function (mr) {
			console.log('listhighlighter highlight from list header h2 change');
			ListHighlighter.highlight(mr);
		}),
		options : {childList: true, subtree: false}
	},

	// FIXME This is called 25 times on updating a title
	listCardTitle : {
		targets : document.querySelectorAll('.list-card-title'),
		observer : new MutationObserver(function () {
			console.log('card process list card title from list card title change');
			Card.processListCardTitle();
		}),
		options : {characterData: true, childList: true, subtree: false}
	}

};

function getWatcher(key) {
	var watcher = watchers[key];
	return watcher;
}

function watch(watcherKey, targets) {

	var watcher = getWatcher(watcherKey);

	targets = targets || watcher.targets;

	if (targets instanceof NodeList || Array.isArray(targets)) {
		for (let i = targets.length - 1; i > -1; i--) {
			watcher.observer.observe(targets[i], watcher.options);
		}
	} else if (targets instanceof HTMLElement) {
		watcher.observer.observe(targets, watcher.options);
	}

}
