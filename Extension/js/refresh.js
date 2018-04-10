 // mod-error mod-warning mod-info mod-confirm

var notificationContainer = document.getElementById('BKMO_RefreshPageMessage');
if (!notificationContainer) {

	notificationContainer = document.createElement('div');
	notificationContainer.id = 'BKMO_RefreshPageMessage';
	notificationContainer.classList.add('app-alert-item', 'mod-confirm');

	let message = document.createElement('p');
	message.textContent = 'List Highlighter has been installed or updated. Please refresh the page when you’re ready.';

	let refreshButton = document.createElement('span');
	refreshButton.classList.add('app-alert-item-button');
	refreshButton.textContent = 'Refresh';
	refreshButton.addEventListener('click', () => { location.reload() });

	notificationContainer.appendChild(message);
	notificationContainer.appendChild(refreshButton);

	let notification = document.getElementById('notification');
	notification.appendChild(notificationContainer);
	notification.style.display = 'block';
}
