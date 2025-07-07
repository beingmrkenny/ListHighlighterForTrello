class System {
	static setup() {
		DataStorage.initialise(() => {
			System.watch('headTitleElement');
			System.watch('trelloBody');
			System.watch('boardForNewLists');
			System.watch('listTitlesForChangesToText');
			System.watch('listBodiesToUndim');
			System.detectAndSaveColorBlindFriendlyMode();
			System.toggleToolbarButton();
			System.keydownUndimSetup();
			System.applyRules();
			TrelloPage.toggleUndimOnHover();
		});
	}

	static getWatcher(key, targets) {
		const watchers = {

			headTitleElement: {
				targets: document.querySelector('title'),
				observer: new MutationObserver(() => {
					System.watch('boardForNewLists');
					System.watch('listTitlesForChangesToText');
					System.watch('listBodiesToUndim');
					System.applyRules();
				}),
				options: { characterData: true, childList: true },
			},

			trelloBody: {
				targets: TrelloPage.getBody(),
				observer: new MutationObserver((mutationRecords) => {
					mutationRecords?.forEach((record) => {
						if (record.attributeName == 'class') {
							const body = TrelloPage.getBody(),
								oldStatus = record?.oldValue?.includes('body-color-blind-mode-enabled'),
								newStatus = body.classList.contains('body-color-blind-mode-enabled');
							if (oldStatus !== newStatus) {
								System.detectAndSaveColorBlindFriendlyMode(newStatus);
							}
						}
						record.addedNodes.forEach((newNode) => {
							if (TrelloPage.getTrellement('lists', newNode, DOWN)) {
								System.watch('boardForNewLists');
								System.watch('listTitlesForChangesToText');
								System.applyRules();
							}
						});
					});
				}),
				options: {
					childList: true,
					subtree: true,
					attributes: true,
					attributeOldValue: true,
				},
			},

			boardForNewLists: {
				targets: TrelloPage.getTrellement('lists'),
				observer: new MutationObserver((mutationRecords) => {
					const listWrapperSelector =
						TrelloPage.getSelectorFromPlain('list-wrapper');
					mutationRecords?.forEach((record) => {
						record.addedNodes.forEach((newNode) => {
							if (newNode.dataset.testid == listWrapperSelector) {
								System.applyRules();
								System.watch('listTitlesForChangesToText');
								System.watch('listBodiesToUndim');
							}
						});
					});
				}),
				options: { childList: true, subtree: true },
			},

			listTitlesForChangesToText: {
				targets: System.getListHeaders(),
				observer: new MutationObserver(() => {
					System.applyRules();
				}),
				options: {
					subtree: true,
					characterData: true,
					characterDataOldValue: true,
				},
			},

			listBodiesToUndim: {
				targets: TrelloPage.getTrellements('list'),
				observer: new MutationObserver((mutationRecords) => {
					const shadowCardSelector =
						TrelloPage.getSelectorFromPlain(
							'list-card-drop-preview'
						);
					mutationRecords.forEach((record) => {
						removeClassesFromMatchingElements('bmko_temporarily-undimmed-list');
						record.addedNodes.forEach((newNode) => {
							if (
								newNode.dataset.testid == shadowCardSelector
							) {
								const list = TrelloPage.getTrellement('list', newNode, UP);
								list.classList.add('bmko_temporarily-undimmed-list');
							}
						});
					});
				}),
				options: { childList: true, subtree: true },
			},
		};

		return watchers[key];
	}

	static getListHeaders() {
		let headers = [];
		TrelloPage.getTrellements('list-header').forEach((listHeader) => {
			headers.push(listHeader.querySelector('h2'));
		});
		return headers;
	}

	static watch(watcherKey) {
		const watcher = System.getWatcher(watcherKey);
		if (watcher.targets instanceof NodeList || Array.isArray(watcher.targets)) {
			for (let target of watcher.targets) {
				System.executeWatcher(target, watcher);
			}
		} else if (watcher.targets instanceof HTMLElement) {
			System.executeWatcher(watcher.targets, watcher);
		}
	}

	static executeWatcher(target, watcher) {
		if (target && target.dataset?.bmkoWatched !== 'yes') {
			target.dataset.bmkoWatched = 'yes';
			watcher.observer.observe(target, watcher.options);
		}
	}

	static applyRules() {
		TrelloPage.toggleListHighlighting(true);
		InsertedCSS.generateRules();
		RulesMatcher.applyCorrectRuleToLists();
	}

	static keydownUndimSetup() {
		if (Global.getItem('options-HighlightUndimOnHover')) {
			document.body.addEventListener('keydown', (e) => {
				// timeout is gross but necessary
				setTimeout(function () {
					if (window.location.pathname.startsWith('/b/')) {
						if (
							[
								'ArrowLeft',
								'ArrowRight',
								'ArrowUp',
								'ArrowDown',
								'<',
								'>',
								',',
								'.',
							].includes(e.key)
						) {
							const focussed = q(':focus');
							if (
								focussed &&
								typeof focussed.dataset.testid == 'string' &&
								focussed.dataset.testid == TrelloPage.getSelectorFromPlain('card-name')
							) {
								const list = TrelloPage.getTrellement('list', focussed, UP);
								removeClassesFromMatchingElements(
									'bmko_temporarily-undimmed-list'
								);
								list.classList.add('bmko_temporarily-undimmed-list');
							}
						}
					}
				}, 0);
			});
		}
	}

	static toggleToolbarButton() {
		const body = TrelloPage.getBody();
		if (body) {
			let toggle = body.classList.contains('bmko_list-highlighter-toggled-off');
			if (typeof toggle == 'boolean') {
				chrome.runtime.sendMessage({ toggledOff: toggle });
			}
		}
	}

	static detectAndSaveColorBlindFriendlyMode(passed) {
		let isActive;
		if (typeof passed == 'undefined') {
			const body = TrelloPage.getBody();
			if (body) {
				isActive = body.classList.contains('body-color-blind-mode-enabled');
			}
		} else {
			isActive = passed;
		}
		if (typeof isActive == 'boolean') {
			chrome.storage.sync.set({ colorBlindFriendlyMode: isActive });
		}
	}
}
