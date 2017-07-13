'use strict';

window.addEventListener('load', function(event) {
	document.body.classList.add('bmko_list-highlighter-applied');
	watchTitleChangesAndSetupBoard();
	watchBoardForNewLists();
	watchListTitleChanges();
	keepTrying(ListHighlighter.highlight, 5, 700);
});

function watchTitleChangesAndSetupBoard() {
	observe({
		targets  : document.querySelector('title'), // could watch board-header-btn-text but it doesn't always exist
		options  : {characterData: true, childList: true, subtree: false}, // subtree to false - check this works
		callback : function (node) {
			watchBoardForNewLists();
			watchListTitleChanges();
			ListHighlighter.highlight();
		}
	});
}

function watchBoardForNewLists() {
	observe({
		targets : document.querySelector('#board'),
		options  : {childList: true, subtree: false},
		callback : function (node) {
			ListHighlighter.highlight();
			watchListTitleChanges();
		}
	});
}

function watchListTitleChanges() {
	observe({
		targets  : document.querySelectorAll('.list-header h2'),
		options  : {childList: true, subtree: false},
		callback : function (node) {
			ListHighlighter.highlight();
		}
	});
}
