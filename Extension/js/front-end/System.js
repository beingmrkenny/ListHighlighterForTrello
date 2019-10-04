class System {

	static setup () {
		DataStorage.initialise(function(results) {
			System.detectAndSaveColorBlindFriendlyMode();
			System.applyRulesOnPageLoad();
			keepCounting(ListWorkPoints.toggleWIP, '.list-card:not(.bmko_header-card-applied)');
			watch('title');
			watch('board');
			watch('listTitle');
			watchForListActions();
			watch('body');
			watch('boardWrapper');
			watch('cardsForDropHover');
			System.toggleToolbarButton();
			System.keydownUndimSetup();
			TrelloPage.toggleUndimOnHover();
			System.headerCardsSetup();
		});
	}

	static applyRulesOnPageLoad () {
		TrelloPage.toggleListHighlighting(true);
		TrelloPage.applyTrelloBackgroundClassNameToTrelloBody();
		InsertedCSS.generateRules();
		// TODO need to delay this till all the lists have loaded, and keepTrying is crap
		RulesMatcher.applyCorrectRuleToLists();
		// keepTrying(RulesMatcher.applyCorrectRuleToLists, 5, 700);
		HeaderTagging.removeAll();
	}

	static runSetupIfBoardNotClosed () {
		if (!q('.board-wrapper .big-message.quiet')) {
			System.setup();
		}
	}

	static keydownUndimSetup () {
		if (Global.getItem('options-HighlightUndimOnHover')) {
			document.body.addEventListener('keydown', (e) => {
				setTimeout(function () {
					if (window.location.pathname.startsWith('/b/')) {
						if (e.key == 'ArrowLeft' || e.key == 'ArrowRight' || e.key == 'ArrowUp' || e.key == 'ArrowDown') {
							let active = q('.active-card'),
								body = getTrelloBody();
							if (body) {
								body.classList.add('bmko_card-is-dragging');
							}
							if (active) {
								let list = active.closest('.list');
								for (let activeList of qq('.bmko_undimmed-list')) {
									activeList.classList.remove('bmko_undimmed-list');
								}
								list.classList.add('bmko_undimmed-list');
								if (window.BMKO_undimTimerId) {
									clearInterval(window.BMKO_undimTimerId);
								}
								window.BMKO_undimTimerId = setTimeout(function () {
									for (let activeList of qq('.bmko_undimmed-list')) {
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

		if (Global.getItem('options-OrganisingEnableHeaderCards') || Global.getItem('options-OrganisingEnableSeparatorCards') || Global.getItem('options-CountEnableWIP')) {

			keepCounting(
				function() {
					watch('list');
					if (Global.getItem('options-OrganisingEnableHeaderCards') || Global.getItem('options-OrganisingEnableSeparatorCards')) {
						watch('listCardTitle');
						// HeaderSeparatorCard.processCards(document.querySelectorAll('.list-card'));
						// FIXME: what's a better way to do this?
						// QUESTION: maybe check .list-cards for changes?
						setTimeout(() => HeaderSeparatorCard.processCards(document.querySelectorAll('.list-card')), 1000);
					}
				},
				'.list-card', 5, 250
			);

			let body = getTrelloBody();
			if (body && (Global.getItem('options-OrganisingEnableHeaderCards') || Global.getItem('options-OrganisingEnableSeparatorCards'))) {
				body.classList.toggle('bmko_header-cards-extra-space', (Global.getItem('options-OrganisingHeaderCardsExtraSpace')));
				body.classList.toggle('bmko_separator-cards-visible-line', (Global.getItem('options-OrganisingSeparatorCardsVisibleLine')));
			}

		}
	}

	static toggleToolbarButton() {
		var body = getTrelloBody();
		if (body) {
			let toggle = body.classList.contains('bmko_list-highlighter-toggled-off');
			if (typeof toggle == 'boolean') {
				chrome.runtime.sendMessage({ toggledOff: toggle });
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
			chrome.storage.sync.set({'colorBlindFriendlyMode': mode});
		}
	}

	// body
	static handleBodyAttributeChanges(mutationRecords) {

		if (typeof mutationRecords !== 'undefined') {

			let mut = mutationRecords[0],
				body = getTrelloBody();

			// This changes when the board background colour changes
			if (mut.attributeName == 'style' && mut.oldValue !== body.getAttribute('style')) {

				TrelloPage.applyTrelloBackgroundClassNameToTrelloBody();

			// This changes when the photo changes
			} else if (mut.attributeName == 'class') {

				let oldStatus = mut.oldValue.includes('body-color-blind-mode-enabled'),
					newStatus = body.classList.contains('body-color-blind-mode-enabled');

				if (oldStatus !== newStatus) {
					System.detectAndSaveColorBlindFriendlyMode(newStatus);
				}

				let oldPhotoBg = mut.oldValue.includes('body-custom-board-background'),
					newPhotoBg = body.classList.contains('body-custom-board-background');

				if (oldPhotoBg !== newPhotoBg) {
					TrelloPage.applyTrelloBackgroundClassNameToTrelloBody();
				}
			}
		}
	}

	// title
	static processPageOnTitleChange() {
		watch('board');
		watch('listTitle');
		watchForListActions();
		System.applyRulesOnPageLoad();
		System.headerCardsSetup();
		ListWorkPoints.toggleWIP();
	}

	// board
	static handleNewLists(mutationRecords) {
		var newList = mutationRecords[0].addedNodes[0];
		if (newList && newList.classList.contains('list-wrapper')) {
			System.applyRulesOnPageLoad();
			watch('listTitle');
			watchForListActions();
			if (Global.getItem('options-OrganisingEnableHeaderCards') || Global.getItem('options-OrganisingEnableSeparatorCards') || Global.getItem('options-CountEnableWIP')) {
				watch('list', newList.querySelector('.list-cards'));
			}
		}
	}

	// list - observes .list-cards
	static handleNewCards(mutationRecords) {

		var targets = [];

		for (let mutationRecord of mutationRecords) {
			if (mutationRecord.addedNodes[0] && mutationRecord.addedNodes[0].matches('.list-card:not(.placeholder)')) {
				let newCard = mutationRecord.addedNodes[0];
				HeaderSeparatorCard.processCards(newCard);
				watch('listCardTitle', newCard.querySelector('.list-card-title'));
				watch('cardsForDropHover', newCard);
			}
		}

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

			if (Global.getItem('options-CountEnableWIP') || Global.getItem('options-HighlightUndimOnHover')) {
				draggedCard = q('#trello-root > .list-card');
				placeholder = q('.placeholder');
				if (draggedCard) {
					let body = getTrelloBody();
					if (body) {
						body.classList.add('bmko_card-is-dragging');
					}
				}
			}

			if (Global.getItem('options-HighlightUndimOnHover')) {
				if (draggedCard) {
					removeClassesFromMatchingElements('bmko_undimmed-list');
				}
				if (placeholder) {
					let list = placeholder.closest('.list');
					if (list) {
						list.classList.add('bmko_undimmed-list');
					}
				}
				// card just been dropped
				if (typeof mutationRecords[0].removedNodes[0] == 'undefined' && !draggedCard) {
					let body = getTrelloBody();
					if (body) {
						body.classList.remove('bmko_card-is-dragging');
					}
					removeClassesFromMatchingElements('bmko_undimmed-list');
				}
			}

			if (Global.getItem('options-CountEnableWIP')) {

				allLists = document.querySelectorAll('.list');

				if (listCards.parentNode && isAddedCard) {
					ListWorkPoints.updateLists();
				}

				// QUESTION need this?
				// if (draggedCard && draggedCard.classList.contains('bmko_header-card-applied')) {
				// 	q('.placeholder').classList.add('bmko_header-card-placeholder');
				// 	// for (let list of allLists) {
				// 	// 	let lwp = new ListWorkPoints(list);
				// 	// }
				// }

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
					} else if (!q('[data-bmko-original-list]')) {
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
		System.applyRulesOnPageLoad();
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
			removeClassesFromMatchingElements('bmko_temporarily-undimmed-list');
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
					removeClassesFromMatchingElements('bmko_temporarily-undimmed-list');
				}
			}
		}

	}

}
