class System {

	static setup() {
		Options.resetIfEmpty(function() {
			Options.load('options', function(options) {
				System.headerCardsSetup();
				System.detectAndSaveColorBlindFriendlyMode();
				Options.load('colors', function(colors) {
					DoingColors.highPriColorStyles();
					keepTrying(ListHighlighter.highlight, 5, 700);
					keepCounting(ListWorkPoints.toggleWIP, '.list-card:not(.bmko_header-card-applied)');
					watch('title');
					watch('board');
					watch('listTitle');
					watch('body');
					System.toggleToolbarButton();
				});
			});
		});
	}

	static headerCardsSetup() {
		if (GLOBAL.EnableHeaderCards || GLOBAL.EnableSeparatorCards || GLOBAL.EnableWIP) {
			let body = getTrelloBody();

			keepCounting(
				function() {
					watch('list');
					if (GLOBAL.EnableHeaderCards || GLOBAL.EnableSeparatorCards) {
						watch('listCardTitle');
						Card.processCards(document.querySelectorAll('.list-card'));
					}
				},
				'.list-card', 5, 250
			);

			if (GLOBAL.EnableHeaderCards || GLOBAL.EnableSeparatorCards) {
				body.classList.toggle('bmko_header-cards-extra-space', (GLOBAL.HeaderCardsExtraSpace));
				body.classList.toggle('bmko_separator-cards-visible-line', (GLOBAL.SeparatorCardsVisibleLine));
			}

		}
	}

	static toggleToolbarButton() {
		if (document && document.body) {
			var body = getTrelloBody();
			var toggle = body.classList.contains('bmko_list-highlighter-toggled-off');
			if (typeof toggle == 'boolean') {
				chrome.runtime.sendMessage({
					toggledOff: toggle
				}, function() {});
			}
		}
	}

	static detectAndSaveColorBlindFriendlyMode(passedMode) {
		var body = getTrelloBody();
		Options.save(
			'colorBlindFriendlyMode',
			passedMode || body.classList.contains('body-color-blind-mode-enabled')
		);
	}

	// QUESTION Does it need a desetup method to get all observers and get rid of them

	// body
	static handleBodyAttributeChanges(mutationRecords) {

		if (typeof mutationRecords !== 'undefined') {

			let mut = mutationRecords[0],
				body = getTrelloBody();

			if (mut.attributeName == 'style' && mut.oldValue !== body.getAttribute('style')) {

				DoingColors.highPriColorStyles()

			} else if (mut.attributeName == 'class') {

				let oldStatus = mut.oldValue.includes('body-color-blind-mode-enabled'),
					newStatus = body.classList.contains('body-color-blind-mode-enabled');
				if (oldStatus !== newStatus) {
					System.detectAndSaveColorBlindFriendlyMode(newStatus);
				}

				let oldPhotoBg = mut.oldValue.includes('body-custom-board-background'),
					newPhotoBg = body.classList.contains('body-custom-board-background');
				if (oldPhotoBg !== newPhotoBg) {
					DoingColors.highPriColorStyles();
				}
			}
		}
	}

	// title
	static processPageOnTitleChange() {
		watch('board');
		watch('listTitle');
		DoingColors.highPriColorStyles();
		ListHighlighter.highlight();
		System.headerCardsSetup();
		ListWorkPoints.toggleWIP();
	}

	// board
	static checkForNewLists(mutationRecords) {
		var newList = mutationRecords[0].addedNodes[0];
		if (newList && newList.classList.contains('list-wrapper')) {
			ListHighlighter.highlight();
			watch('listTitle');
			if (GLOBAL.EnableHeaderCards || GLOBAL.EnableSeparatorCards || GLOBAL.EnableWIP) {
				watch('list', newList.querySelector('.list-cards'));
			}
		}
	}

	// list - observes .list-cards
	static checkForNewCards(mutationRecords) {
		if (mutationRecords[0] && mutationRecords[0] instanceof MutationRecord) {

			var listCards = mutationRecords[0].target,
				newCard = mutationRecords[0].addedNodes[0],
				isAddedCard = (typeof newCard != 'undefined'
					&& newCard instanceof HTMLElement
					&& newCard.classList.contains('active-card')
				),
				allLists;

			if (isAddedCard) {
				Card.processCards(newCard);
				watch('listCardTitle', newCard.querySelector('.list-card-title'));
			} else {
				// for dragging between lists
				// QUESTION is this necessary?
				Card.processCards(listCards.querySelectorAll('.list-card'));
			}

			if (GLOBAL.EnableWIP) {

				allLists = document.querySelectorAll('.list');

				if (listCards.parentNode && isAddedCard) {
					ListWorkPoints.updateLists();
				}

				let draggedCard = document.body.querySelector('body > .list-card');

				// QUESTION need this?
				if (draggedCard && draggedCard.classList.contains('bmko_header-card-applied')) {
					$('.placeholder').classList.add('bmko_header-card-placeholder');
					for (let list of allLists) {
						let lwp = new ListWorkPoints(list);
					}
				}

				for (let record of mutationRecords) {

					if (draggedCard) {

						for (let list of allLists) {
							let lwp = new ListWorkPoints(list);
							lwp.toggleWouldBeOverWhileDragging(draggedCard);
						}

					} else {
						ListWorkPoints.updateLists(allLists);
					}

				}

				if (typeof mutationRecords[0].removedNodes[0] == 'undefined') {

					if (!draggedCard) {

						// Card just been dropped
						for (let list of allLists) {
							let lwp = new ListWorkPoints(list);
							lwp.toggleOriginalList(false);
						}

					} else if (!$('[data-bmko-original-list]')) {

						// Card picked up
						let lwp = new ListWorkPoints(listCards.closest('.list'));
						lwp.toggleOriginalList(true);

					}
				}

			}
		}
	}


}
