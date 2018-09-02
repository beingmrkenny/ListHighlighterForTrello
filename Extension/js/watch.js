function getWatcher(key, targets) {

	var watchers = {

		body : {
			targets: getTrelloBody(),
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

		// If re-opening a closed board
		boardWrapper : {
			targets : document.querySelector('.board-wrapper'),
			observer: new MutationObserver(function () {
				if (!$('.board-wrapper .big-message.quiet')) {
					System.setup();
				}
			}),
			options : {childList: true}
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

		cardComposer : {
			targets : document.querySelectorAll('.open-card-composer'),
			observer : new MutationObserver(function (mutationRecords) {
				var cardComposer = mutationRecords[0].target;
				cardComposer.closest('.list').classList.toggle(
					'bmko_temporarily-undimmed-list',
					cardComposer.classList.contains('hide')
				);
			}),
			options : {attributes: true}
		},

		popOver : {
			targets : document.querySelectorAll('.pop-over'),
			options : {attributes: true},
			observer : new MutationObserver(function (mutationRecords) {
				var popOver = mutationRecords[0].target;
				if (ovalue(popOver.querySelector('.pop-over-header-title'), 'textContent') == 'List Actions') {
					findElementByLeftPosition (ovalue(popOver, 'style', 'left'), 'list', (element) => {
						element.classList.add('bmko_temporarily-undimmed-list');
					});
				} else {
					removeClasses('bmko_temporarily-undimmed-list');
				}
			})
		},

		forQuickCardEditor : {
			targets : $id('classic'),
			options : { childList: true },
			observer : new MutationObserver(function (mutationRecords) {

				for (let mutation of mutationRecords) {
					for (let added of mutation.addedNodes) {
						if (added.classList.contains('quick-card-editor')) {
							let left = ovalue(added.querySelector('.quick-card-editor-card'), 'style', 'left');
							findElementByLeftPosition (left, 'list', (element) => {
								element.classList.add('bmko_temporarily-undimmed-list');
							});
						}
					}
					for (let removed of mutation.removedNodes) {
						if (removed.classList.contains('quick-card-editor')) {
							removeClasses('bmko_temporarily-undimmed-list');
						}
					}
				}

			})
		},

		// REVIEW this accumulates too easily
		listCardTitle : {
			targets : targets || document.querySelectorAll('.list-card-title'),
			observer : new MutationObserver(Card.processListCardTitle),
			options : {characterData: true, childList: true, subtree: false}
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
