document.getElementsByTagName('form')[0].onsubmit = function updateBot() {
	const boxes = Array.from(document.querySelectorAll('input[type=checkbox]'));

	boxes.forEach((box) => {
		if (box.checked !== box.getAttribute('data-was-checked')) {
			const request = new XMLHttpRequest();
			const data = {
				moduleId: Number(event.target.getAttribute('id')),
				userId: Number(event.target.getAttribute('data-user-id')),
			};

			request.open('POST', `http://${server}/usermodules/${box.checked ? 'enable' : 'disable'}`, false);
			request.setRequestHeader('Content-Type', 'application/json');
			request.send(JSON.stringify(data));
		}
	});

	return false;
};