Array.from(document.getElementsByClassName('toggle-module')).forEach((btn) => {
	btn.onclick = function(event) {
		const isEnabled = event.target.innerText === 'Add Module to Bot';
		const request = new XMLHttpRequest();
		const data = {
			moduleId: Number(event.target.getAttribute('data-module-id')),
			userId: Number(event.target.getAttribute('data-user-id')),
		};

		request.open('POST', `http://${server}/usermodules/${isEnabled ? 'enable' : 'disable'}`, true);
		request.setRequestHeader('Content-Type', 'application/json');

		request.onload = function() {
			if (request.status >= 200 && request.status < 400) {
				// Success!
				event.target.innerText = isEnabled ? 'Remove Module from Bot' : 'Add Module to Bot';
			} else {
				// We reached our target server, but it returned an error
				console.error('oops!', request);
			}
		};

		request.onerror = function() {
			// There was a connection error of some sort
			console.error('oops!', request);
		};

		request.send(JSON.stringify(data));
	};
});