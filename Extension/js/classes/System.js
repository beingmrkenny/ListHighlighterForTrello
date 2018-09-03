class System {

	static setup () {
		Options.initialise(function(results) {
			System.headerCardsSetup();
			System.detectAndSaveColorBlindFriendlyMode();
			DoingColors.init(Options.processColors(results));
			DoingColors.highPriColorStyles();
			keepTrying(ListHighlighter.highlight, 5, 700);
			keepCounting(ListWorkPoints.toggleWIP, '.list-card:not(.bmko_header-card-applied)');
			watch('title');
			watch('board');
			watch('listTitle');
			watchForListActions();
			watch('body');
			watch('boardWrapper');
			watch('cardsForDropHover');
			System.toggleToolbarButton();
			DoingColors.setupDimmingCSS();
			System.keydownUndimSetup();
		});
	}

	static runSetupIfBoardNotClosed () {
		if (!$('.board-wrapper .big-message.quiet')) {
			System.setup();
		}
	}

	static keydownUndimSetup () {
		if (GLOBAL.UndimOnHover) {
			// FIXME Does this get applied lots of different times, and therefore accumulate?
			document.body.addEventListener('keydown', (e) => {
				setTimeout(function () {
					if (window.location.pathname.startsWith('/b/')) {
						if (e.key == 'ArrowLeft' || e.key == 'ArrowRight' || e.key == 'ArrowUp' || e.key == 'ArrowDown') {
							let active = $('.active-card'),
								body = getTrelloBody();
							if (body) {
								body.classList.add('bmko_card-is-dragging');
							}
							if (active) {
								let list = active.closest('.list');
								for (let activeList of $$('.bmko_undimmed-list')) {
									activeList.classList.remove('bmko_undimmed-list');
								}
								list.classList.add('bmko_undimmed-list');
								if (window.BMKO_undimTimerId) {
									clearInterval(window.BMKO_undimTimerId);
								}
								window.BMKO_undimTimerId = setTimeout(function () {
									for (let activeList of $$('.bmko_undimmed-list')) {
										activeList.classList.remove('bmko_undimmed-list');
									}
									if (body) {
										body.classList.remove('bmko_card-is-dragging');
									}
								}, 5000);
							}
						}
					}
				}, 0);
			});
		}
	}

	static headerCardsSetup() {
		if (GLOBAL.EnableHeaderCards || GLOBAL.EnableSeparatorCards || GLOBAL.EnableWIP) {

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

			let body = getTrelloBody();
			if (body && (GLOBAL.EnableHeaderCards || GLOBAL.EnableSeparatorCards)) {
				body.classList.toggle('bmko_header-cards-extra-space', (GLOBAL.HeaderCardsExtraSpace));
				body.classList.toggle('bmko_separator-cards-visible-line', (GLOBAL.SeparatorCardsVisibleLine));
			}

		}
	}

	static toggleToolbarButton() {
		var body = getTrelloBody();
		if (body) {
			let toggle = body.classList.contains('bmko_list-highlighter-toggled-off');
			if (typeof toggle == 'boolean') {
				chrome.runtime.sendMessage({
					toggledOff: toggle
				}, function() {});
			}
		}
	}

	static detectAndSaveColorBlindFriendlyMode(passedMode) {
		var mode;
		if (typeof passedMode == 'undefined') {
			let body = getTrelloBody();
			if (body) {
				mode = body.classList.contains('body-color-blind-mode-enabled');
			}
		} else {
			mode = passedMode;
		}
		if (typeof mode == 'boolean') {
			Options.save({'colorBlindFriendlyMode': mode});
		}
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
		watchForListActions();
		DoingColors.highPriColorStyles();
		ListHighlighter.highlight();
		System.headerCardsSetup();
		ListWorkPoints.toggleWIP();
	}

	// board
	static handleNewLists(mutationRecords) {
		var newList = mutationRecords[0].addedNodes[0];
		if (newList && newList.classList.contains('list-wrapper')) {
			ListHighlighter.highlight();
			watch('listTitle');
			watchForListActions();
			if (GLOBAL.EnableHeaderCards || GLOBAL.EnableSeparatorCards || GLOBAL.EnableWIP) {
				watch('list', newList.querySelector('.list-cards'));
			}
		}
	}

	// list - observes .list-cards
	static handleNewCards(mutationRecords) {
		if (mutationRecords[0] && mutationRecords[0] instanceof MutationRecord) {

			var listCards = mutationRecords[0].target,
				newCard = mutationRecords[0].addedNodes[0],
				isAddedCard = (typeof newCard != 'undefined'
					&& newCard instanceof HTMLElement
					&& newCard.classList.contains('active-card')
				),
				allLists,
				draggedCard,
				placeholder;

			if (GLOBAL.EnableWIP || GLOBAL.UndimOnHover) {
				draggedCard = document.body.querySelector('body > .list-card');
				placeholder = $('.placeholder');
				if (draggedCard) {
					let body = getTrelloBody();
					if (body) {
						body.classList.add('bmko_card-is-dragging');
					}
				}
			}

			if (GLOBAL.UndimOnHover) {

				if (draggedCard) {
					for (let list of document.querySelectorAll('.bmko_undimmed-list')) {
						list.classList.remove('bmko_undimmed-list');
					}
				}
				let list = placeholder.closest('.list');
				if (list) {
					list.classList.add('bmko_undimmed-list');
				}

				// card just been dropped
				if (typeof mutationRecords[0].removedNodes[0] == 'undefined' && !draggedCard) {

					let body = getTrelloBody();
					if (body) {
						body.classList.remove('bmko_card-is-dragging');
					}

					for (let list of document.querySelectorAll('.bmko_undimmed-list')) {
						list.classList.remove('bmko_undimmed-list');
					}

				}

			}

			if (isAddedCard) {
				Card.processCards(newCard);
				watch('listCardTitle', newCard.querySelector('.list-card-title'));
				watch('cardsForDropHover', newCard);
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

						let body = getTrelloBody();
						if (body) {
							body.classList.remove('bmko_card-is-dragging');
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

	static handleListTitleChange (mutationRecords) {
		var listTitle = mutationRecords[0].target;
		ListHighlighter.highlight();
		if (listTitle && listTitle.parentNode) {
			let listWorkPoints = new ListWorkPoints(listTitle.closest('.list'));
			listWorkPoints.update();
		}
	}

	static handleCardClassChange (mutationRecords) {
		for (let mutation of mutationRecords) {
			if (mutation.type == 'attributes' && mutation.attributeName == 'class') {
				let list = mutation.target.closest('.list');
				if (mutation.target.classList.contains('is-drophover') && !list.classList.contains('bmko_temporarily-undimmed-list')) {
					list.classList.add('bmko_temporarily-undimmed-list');
				} else if (mutation.oldValue.includes('is-drophover')) {
					list.classList.remove('bmko_temporarily-undimmed-list');
				}
			}
		}
	}

	static handleCardComposer (mutationRecords) {
		var cardComposer = mutationRecords[0].target;
		cardComposer.closest('.list').classList.toggle(
			'bmko_temporarily-undimmed-list',
			cardComposer.classList.contains('hide')
		);
	}

	static handleListActionPopOver (mutationRecords) {
		var popOver = mutationRecords[0].target;
		if (ovalue(popOver.querySelector('.pop-over-header-title'), 'textContent') == 'List Actions') {
			findElementByLeftPosition (ovalue(popOver, 'style', 'left'), 'list', (element) => {
				element.classList.add('bmko_temporarily-undimmed-list');
			});
		} else {
			removeClasses('bmko_temporarily-undimmed-list');
		}
	}

	static handleQCE (mutationRecords) {

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

	}

}
