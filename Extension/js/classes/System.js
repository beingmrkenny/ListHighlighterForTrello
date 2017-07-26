class System {

	static setup () {

		Options.load('options', function (results) {

			System.saveOptionsAsGlobal(results.options);
			System.headerCardsSetup();
			System.detectAndSaveColorBlindFriendlyMode();

			Options.load('colors', function (results) {

				GLOBAL.colors = results.colors;
				DoingColors.highPriColorStyles();

				keepTrying(ListHighlighter.highlight, 5, 700);

				watch ('title');
				watch ('board');
				watch ('listTitle');
				watch ('body');
			});

		});

	}

	static saveOptionsAsGlobal(options) {
		for (let name in options) {
			GLOBAL[name] = options[name];
		}
	}

	static headerCardsSetup () {
		if (GLOBAL.EnableHeaderCards || GLOBAL.EnableSeparatorCards) {
			keepCounting (
			    function () {
					watch ('listCardTitle');
					watch ('list');
					Card.processCards(document.querySelectorAll('.list-card'));
				},
			    '.list-card', 5, 250
			);
		}
	}

	// TODO Does it need a destup method to get all observers and get rid of them

	// body
	static handleBodyAttributeChanges (mutationRecords) {

		if (typeof mutationRecords !== 'undefined') {

			let mut = mutationRecords[0];

			if (mut.attributeName == 'style' && mut.oldValue !== document.body.getAttribute('style')) {

				DoingColors.highPriColorStyles()

			} else if (mut.attributeName == 'class') {

				let oldStatus = mut.oldValue.includes('body-color-blind-mode-enabled'),
					newStatus = document.body.classList.contains('body-color-blind-mode-enabled');
				if (oldStatus !== newStatus) {
					detectAndSaveColorBlindFriendlyMode(newStatus);
				}

			}

		}

	}

	static detectAndSaveColorBlindFriendlyMode (passedMode) {
		Options.save(
			'colorBlindFriendlyMode',
			passedMode || document.body.classList.contains('body-color-blind-mode-enabled')
		);
	}

	// title
	static processPageOnTitleChange () {
		watch ('board');
		watch ('listTitle');
		DoingColors.highPriColorStyles();
		ListHighlighter.highlight();
		System.headerCardsSetup();
	}

	// board
	static checkForNewLists (mutationRecords) {

		if (GLOBAL.EnableHeaderCards || GLOBAL.EnableSeparatorCards) {
			var newList = mutationRecords[0].addedNodes[0];
		    if (newList && newList.classList.contains('list-wrapper')) {
		        watch ('list', newList.querySelector('.list-cards'));
		    }
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
