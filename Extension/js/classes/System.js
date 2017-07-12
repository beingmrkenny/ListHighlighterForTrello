class System {

	static setup () {
		watch (document.querySelector('title'), watchers.title);
		System.headerCardsSetup();
		System.watchBoardForNewLists();
		System.watchListTitleChanges();
		keepTrying(ListHighlighter.highlight, 5, 700);
		System.detectAndSaveColorBlindFriendlyMode();
		System.watchBodyClasslistForColorBlindFriendlyMode();
	}

	static headerCardsSetup () {
		// used to be a title watcher here
		watch (document.querySelectorAll('.list-card-title'), watchers.listCardTitle);
		watch (document.getElementById('board'), watchers.board);
		watch (document.querySelectorAll('.list-cards'), watchers.list);
	}

	// TODO Does it need a destup method to get all observers and get rid of them

	// body
	static watchBodyClasslistForColorBlindFriendlyMode () {
		watch (document.body, watchers.body);
	}

	// body
	static detectAndSaveColorBlindFriendlyMode (mutationRecords) {

		if (typeof mutationRecords !== 'undefined') {

			let oldClass = mutationRecords[0].oldValue;
			if (oldClass) {
				let oldStatus = oldClass.includes('body-color-blind-mode-enabled'),
					newStatus = document.body.classList.contains('body-color-blind-mode-enabled');
				if (oldStatus !== newStatus) {
					Options.save('colorBlindFriendlyMode', newStatus);
				}
			}

		} else {
			Options.save(
				'colorBlindFriendlyMode',
				document.body.classList.contains('body-color-blind-mode-enabled')
			);
		}

	}

	// title
	static processPageOnTitleChange () {
		System.watchBoardForNewLists();
		System.watchListTitleChanges();
		ListHighlighter.highlight();
		window.setTimeout (System.headerCardsSetup, 100);
	}

	// board
	static watchBoardForNewLists() {
		watch (document.querySelector('#board'), watchers.board);
	}

	// board
	static checkForNewLists (mutationRecords) {

	    var newList = mutationRecords[0].addedNodes[0];
	    if (newList && newList.classList.contains('list-wrapper')) {
	        watch (newList.querySelector('.list-cards'), watchers.list);
	    }

		ListHighlighter.highlight();
		System.watchListTitleChanges();
	}

	// list
	static checkForNewCards (mutationRecords) {
	    if (mutationRecords[0] && mutationRecords[0] instanceof MutationRecord) {
	        var newCard = mutationRecords[0].addedNodes[0];
	        if (newCard && newCard.classList.contains('list-card')) {
	            Card.processCards(newCard);
	            watch (newCard.querySelector('.list-card-title'), watchers.listCardTitle);
	        } else {
	            Card.processCards(mutationRecords[0].target.querySelectorAll('.list-card'));
	        }
	    }
	}

	// list title
	static watchListTitleChanges() {
		watch (document.querySelectorAll('.list-header h2'), watchers.listTitle);
	}

}
