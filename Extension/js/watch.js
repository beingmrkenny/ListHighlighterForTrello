function getWatcher(key, targets) {

	var watchers = {

		body : {
			targets: document.body,
			observer : new MutationObserver(System.handleBodyAttributeChanges),
			options : {childList: false, subtree: false, attributes: true, attributeOldValue: true}
		},

		title : {
			targets : document.querySelector('title'),
			observer : new MutationObserver(System.processPageOnTitleChange),
			options : {characterData: true, childList: true, subtree: false}
		},

		// Watch board for changes to lists
		board : {
			targets : document.getElementById('board'),
			observer: new MutationObserver(System.checkForNewLists),
			options : {childList: true, subtree: false}
		},

		// multiple times because it goes on every card on a list
		list : {
			targets : targets || document.querySelectorAll('.list-cards'),
			observer: new MutationObserver(System.checkForNewCards),
			options : {childList: true, subtree: false}
		},

		listTitle : {
			targets : document.querySelectorAll('.list-header h2'),
			observer : new MutationObserver(function (mutationRecords) {
				var listTitle = mutationRecords[0].target;
				ListHighlighter.highlight();
				if (listTitle && listTitle.parentNode) {
					let listWorkPoints = new ListWorkPoints(listTitle.closest('.list'));
					listWorkPoints.update();
				}
			}),
			options : {childList: true, subtree: false}
		},

		// FIXME this accumulates too easily
		listCardTitle : {
			targets : targets || document.querySelectorAll('.list-card-title'),
			observer : new MutationObserver(Card.processListCardTitle),
			options : {characterData: true, childList: true, subtree: false}
		}

	};

	return watchers[key];
}

function watch (watcherKey, targets) {

	var watcher = getWatcher(watcherKey, targets);

	if (watcher.targets instanceof NodeList || Array.isArray(watcher.targets)) {
		for (let target of watcher.targets) {
			executeWatcher (target, watcher);
		}
	} else if (watcher.targets instanceof HTMLElement) {
		executeWatcher (watcher.targets, watcher);
	}

}

function executeWatcher (target, watcher) {
	// FIXME workaround till I can work out how not to apply this multiple times in a better way
	if (!target.dataset.bmkoWatched) {
		target.dataset.bmkoWatched = 'yes';
		watcher.observer.observe(target, watcher.options);
	}
}
