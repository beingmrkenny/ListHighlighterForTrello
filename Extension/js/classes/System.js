class System {

	static setup() {
		Options.resetIfEmpty(function() {
			Options.load('options', function(options) {
				System.headerCardsSetup();
				System.cardLabelText();
				System.detectAndSaveColorBlindFriendlyMode();
				Options.load('colors', function(colors) {
					DoingColors.highPriColorStyles();
					keepTrying(ListHighlighter.highlight, 5, 700);
					if (window.location.pathname.startsWith('/c/')) {
						System.processCardDetailWindow();
					}
					watch('title');
					watch('board');
					watch('listTitle');
					watch('body');
					watch('viewCard');
					System.toggleToolbarButton();
				});
			});
		});
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

			body.classList.toggle('bmko_header-cards-extra-space', (GLOBAL.HeaderCardsExtraSpace));
			body.classList.toggle('bmko_separator-cards-visible-line', (GLOBAL.SeparatorCardsVisibleLine));

		}
	}

	static cardLabelText () {

		var labelTextDisplayed = document.body.classList.contains('body-card-label-text', 'body-card-label-text-on'),
			firstLabel = document.querySelector('.card-label.mod-card-front');

		if (GLOBAL.ShowCardLabelText && firstLabel) {

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

			let style = createElement(
				`<style type="text/css" id="CardLabelTextStyle">
					.body-card-label-text .card-label.mod-card-front,
					.body-card-label-text-on .card-label.mod-card-front {
						padding: 0 3px;
					}
					${transform}
				</style>`
			);

			let existingStyle = $id('CardLabelTextStyle');

			if (existingStyle) {
				existingStyle.remove();
			}

			document.head.appendChild(style);

		}

		if (GLOBAL.ShowCardLabelText !== labelTextDisplayed && firstLabel) {
			firstLabel.click();
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

	static clickHideItems() {
		var shownCompletedItems = document.querySelectorAll('.js-hide-checked-items:not(.hide)');
		for (let i = shownCompletedItems.length -1; i > -1; i--) {
			shownCompletedItems[i].click();
		}
	}

	static clickHideDetails() {
	    var hideDetails = document.querySelector('.js-hide-details');
	    if (hideDetails && !hideDetails.classList.contains('hide')) {
	        hideDetails.click();
	    }
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

	// view card details
	static processCardDetailWindow(mutationRecords) {

		if (document.querySelector('.card-detail-window')) {

			if (GLOBAL.HideCompletedItems) {
				keepCounting(System.clickHideItems, '.js-hide-checked-items');
			}

			if (GLOBAL.HideActivity) {
				keepChecking (
					System.clickHideDetails,
					function () {
						var target = document.querySelector('.js-hide-details');
						return (target && !target.classList.contains('hide'));
					}
				);
			}

		}

	}

}
