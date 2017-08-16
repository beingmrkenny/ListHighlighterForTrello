class System {

	static setup() {
		Options.resetIfEmpty(function() {
			Options.load('options', function(options) {
				System.saveOptionsAsGlobal(options);
				System.detectAndSaveColorBlindFriendlyMode();
				System.headerCardsSetup();
				System.cardLabelText();
				Options.load('colors', function(colors) {
					GLOBAL.colors = colors;
					DoingColors.highPriColorStyles();
					keepTrying(ListHighlighter.highlight, 5, 700);
					watch('title');
					watch('board');
					watch('listTitle');
					watch('body');
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

	static headerCardsSetup() {
		if (GLOBAL.EnableHeaderCards || GLOBAL.EnableSeparatorCards) {
			let body = document.body;

			keepCounting(
				function() {
					watch('listCardTitle');
					watch('list');
					Card.processCards(document.querySelectorAll('.list-card'));
				},
				'.list-card', 5, 250
			);

			setTimeout(function () {
				body.classList.toggle('bmko_header-cards-extra-space', (GLOBAL.HeaderCardsExtraSpace));
				body.classList.toggle('bmko_separator-cards-visible-line', (GLOBAL.SeparatorCardsVisibleLine));
			}, 0);

		}
	}

	static cardLabelText () {

		var labelTextDisplayed = document.body.classList.contains('body-card-label-text', 'body-card-label-text-on'),
			firstLabel = document.querySelector('.card-label.mod-card-front');

		// FIXME This setTimeout is commented but WHO CAN KNOW it might be needed, check and remove as nec
		// setTimeout(function () {

			if (GLOBAL.ShowCardLabelText && !$id('CardLabelTextStyle') && firstLabel) {

				let transform = '';
				if (GLOBAL.CardLabelsUppercase) {
					transform =
						`.body-card-label-text .card-label.mod-card-front,
						.body-card-label-text-on .card-label.mod-card-front,
						.body-card-label-text .card-label.mod-card-detail,
						.body-card-label-text-on .card-label.mod-card-detail {
							text-transform: uppercase;
						}`;
				}

				document.head.appendChild(createElement(
					`<style type="text/css" id="CardLabelTextStyle">
						.body-card-label-text .card-label.mod-card-front,
						.body-card-label-text-on .card-label.mod-card-front {
							padding: 0 3px;
						}
						${transform}
					</style>`
				));

			}

			if (GLOBAL.ShowCardLabelText !== labelTextDisplayed && firstLabel) {
				firstLabel.click();
			}

		// }, 0);

	}

	// QUESTION Does it need a desetup method to get all observers and get rid of them

	// body
	static handleBodyAttributeChanges(mutationRecords) {

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
		if (document && document.body) {
			var toggle = document.body.classList.contains('bmko_list-highlighter-toggled-off');
			if (typeof toggle == 'boolean') {
				chrome.runtime.sendMessage({
					toggledOff: toggle
				}, function() {});
			}
		}
	}

	static detectAndSaveColorBlindFriendlyMode(passedMode) {
		Options.save(
			'colorBlindFriendlyMode',
			passedMode || document.body.classList.contains('body-color-blind-mode-enabled')
		);
	}

	// title
	static processPageOnTitleChange() {
		watch('board');
		watch('listTitle');
		DoingColors.highPriColorStyles();
		ListHighlighter.highlight();
		System.headerCardsSetup();
	}

	// board
	static checkForNewLists(mutationRecords) {
		var newList = mutationRecords[0].addedNodes[0];
		if (newList && newList.classList.contains('list-wrapper')) {
			ListHighlighter.highlight();
			watch('listTitle');
			if (GLOBAL.EnableHeaderCards || GLOBAL.EnableSeparatorCards) {
				watch('list', newList.querySelector('.list-cards'));
			}
		}
	}

	// list
	static checkForNewCards(mutationRecords) {
		if (mutationRecords[0] && mutationRecords[0] instanceof MutationRecord) {
			var newCard = mutationRecords[0].addedNodes[0];
			if (newCard && newCard.classList.contains('list-card')) {
				// for new cards and dragged cards
				Card.processCards(newCard);
				watch('listCardTitle', newCard.querySelector('.list-card-title'));
			} else {
				// for dragging between lists
				let card = mutationRecords[0].target.querySelectorAll('.list-card');
				Card.processCards(card);
			}
		}
	}

}
