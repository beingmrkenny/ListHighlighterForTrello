function getWatcher(key, targets) {

	var watchers = {

		body : {
			targets: getTrelloBody(),
			observer : new MutationObserver(System.handleBodyAttributeChanges),
			options : {attributes: true, attributeOldValue: true}
		},

		title : {
			targets : document.querySelector('title'),
			observer : new MutationObserver(System.processPageOnTitleChange),
			options : {characterData: true, childList: true}
		},

		// Watch board for changes to lists
		board : {
			targets : document.getElementById('board'),
			observer: new MutationObserver(System.handleNewLists),
			options : {childList: true}
		},

		// If re-opening a closed board
		boardWrapper : {
			targets : document.querySelector('.board-wrapper'),
			observer: new MutationObserver(System.runSetupIfBoardNotClosed),
			options : {childList: true}
		},

		// multiple times because it goes on every card on a list
		list : {
			targets : targets || document.querySelectorAll('.list-cards'),
			observer: new MutationObserver(System.handleNewCards),
			options : {childList: true}
		},

		listTitle : {
			targets : document.querySelectorAll('.list-header h2'),
			observer : new MutationObserver(System.handleListTitleChange),
			options : {childList: true}
		},

		cardsForDropHover : {
			targets : targets || document.querySelectorAll('.list-card'),
			observer : new MutationObserver(System.handleCardClassChange),
			options : {attributes: true, attributeOldValue: true}
		},

		cardComposer : {
			targets : document.querySelectorAll('.open-card-composer'),
			observer : new MutationObserver(System.handleCardComposer),
			options : {attributes: true}
		},

		popOver : {
			targets : document.querySelectorAll('.pop-over'),
			options : {attributes: true},
			observer : new MutationObserver(System.handleListActionPopOver)
		},

		forQuickCardEditor : {
			targets : qid('classic'),
			options : { childList: true },
			observer : new MutationObserver(System.handleQCE)
		},

		// REVIEW this accumulates too easily
		listCardTitle : {
			targets : targets || document.querySelectorAll('.list-card-title'),
			observer : new MutationObserver(Card.processListCardTitle),
			options : {characterData: true, childList: true}
		}

	};

	return watchers[key];
}

function watchForListActions () {
	watch('cardComposer');
	watch('popOver');
	watch('forQuickCardEditor');
}

// FIXME is targets ever used?
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
	// REVIEW workaround till I can work out how not to apply this multiple times in a better way
	if (!target.dataset.bmkoWatched) {
		target.dataset.bmkoWatched = 'yes';
		watcher.observer.observe(target, watcher.options);
	}
}
