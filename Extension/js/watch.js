// FIXME should this be a method that returns the appropriate crap instead of a global var?
var watchers = {

	body : {
		observer : new MutationObserver(System.detectAndSaveColorBlindFriendlyMode),
		options : {childList: false, subtree: false, attributes: true, attributeOldValue: true}
	},

	title : {
		observer : new MutationObserver(System.processPageOnTitleChange),
		options : {characterData: true, childList: true, subtree: false}
	},

	board : {
		observer: new MutationObserver(System.checkForNewLists),
		options : {childList: true, subtree: false}
	},

	list : {
		observer: new MutationObserver(System.checkForNewCards),
		options : {childList: true, subtree: false}
	},

	listTitle : {
		observer : new MutationObserver(ListHighlighter.highlight),
		options : {childList: true, subtree: false}
	},

	listCardTitle : {
		observer : new MutationObserver(Card.processListCardTitle),
		options : {characterData: true, childList: true, subtree: false}
	}

};

function watch(targets, watcher) {

	if (targets instanceof NodeList || Array.isArray(targets)) {
		for (let i = targets.length - 1; i > -1; i--) {
			watcher.observer.observe(targets[i], watcher.options);
		}
	} else if (targets instanceof HTMLElement) {
		watcher.observer.observe(targets, watcher.options);
	}

}
