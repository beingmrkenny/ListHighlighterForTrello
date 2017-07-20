class System {

	static setup () {
		watch ('title');
		System.headerCardsSetup();
		watch ('board');
		watch ('listTitle');
		keepTrying(ListHighlighter.highlight, 5, 700);
		System.detectAndSaveColorBlindFriendlyMode();
		watch ('body');
	}

	static headerCardsSetup () {
		// used to be a title watcher here
		watch ('listCardTitle');
		watch ('board');
		watch ('list');
	}

	// TODO Does it need a destup method to get all observers and get rid of them

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
		watch ('board');
		watch ('listTitle');
		ListHighlighter.highlight();
		window.setTimeout (System.headerCardsSetup, 100);
	}

	// board
	static checkForNewLists (mutationRecords) {

	    var newList = mutationRecords[0].addedNodes[0];
	    if (newList && newList.classList.contains('list-wrapper')) {
	        watch ('list', newList.querySelector('.list-cards'));
	    }

		ListHighlighter.highlight();
		watch ('listTitle');
	}

	// list
	static checkForNewCards (mutationRecords) {
	    if (mutationRecords[0] && mutationRecords[0] instanceof MutationRecord) {
	        var newCard = mutationRecords[0].addedNodes[0];
	        if (newCard && newCard.classList.contains('list-card')) {
	            Card.processCards(newCard);
	            watch ('listCardTitle', newCard.querySelector('.list-card-title'));
	        } else {
	            Card.processCards(mutationRecords[0].target.querySelectorAll('.list-card'));
	        }
	    }
	}

}
