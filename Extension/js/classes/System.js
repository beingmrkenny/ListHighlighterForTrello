class System {

	static setup () {

		Options.resetIfEmpty(function () {

			Options.load('options', function (options) {

				System.saveOptionsAsGlobal(options);
				System.headerCardsSetup();
				System.detectAndSaveColorBlindFriendlyMode();

				Options.load('colors', function (colors) {
					GLOBAL.colors = colors;
					DoingColors.highPriColorStyles();
					keepTrying(ListHighlighter.highlight, 5, 700);
					watch ('title');
					watch ('board');
					watch ('listTitle');
					watch ('body');
					System.toggleToolbarButton();
				});

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

		console.log('body attr change');

		if (typeof mutationRecords !== 'undefined') {

			let mut = mutationRecords[0];

			if (mut.attributeName == 'style' && mut.oldValue !== document.body.getAttribute('style')) {

				DoingColors.highPriColorStyles()

			} else if (mut.attributeName == 'class') {

				let oldStatus = mut.oldValue.includes('body-color-blind-mode-enabled'),
					newStatus = document.body.classList.contains('body-color-blind-mode-enabled');
				if (oldStatus !== newStatus) {
					System.detectAndSaveColorBlindFriendlyMode(newStatus);
				}

				let oldPhotoBg = mut.oldValue.includes('body-custom-board-background'),
					newPhotoBg = document.body.classList.contains('body-custom-board-background');
				if (oldPhotoBg !== newPhotoBg) {
					DoingColors.highPriColorStyles();
				}

			}

		}

	}

	static toggleToolbarButton() {
		chrome.runtime.sendMessage({toggledOff: document.body.classList.contains('bmko_list-highlighter-toggled-off')}, function() {});
	}

	static detectAndSaveColorBlindFriendlyMode (passedMode) {
		Options.save(
			'colorBlindFriendlyMode',
			passedMode || document.body.classList.contains('body-color-blind-mode-enabled')
		);
	}

	// title
	static processPageOnTitleChange () {
		console.log('process page on title change');
		watch ('board');
		watch ('listTitle');
		DoingColors.highPriColorStyles();
		ListHighlighter.highlight();
		System.headerCardsSetup();
	}

	// board
	static checkForNewLists (mutationRecords) {

		console.log('check for new lists');

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
		console.log('check for new cards');
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
