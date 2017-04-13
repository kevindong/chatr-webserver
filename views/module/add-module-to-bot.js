document.getElementsByTagName('form')[0].onsubmit = function updateBot(e) {
	e.preventDefault();

	const boxes = Array.from(document.querySelectorAll('input[type=checkbox]'));

	boxes.forEach((box) => {
		console.log(box.checked, box.checked === true, box.getAttribute('data-was-checked'), box.getAttribute('data-was-checked') === '');
		if ((box.checked === true || box.getAttribute('data-was-checked') === '') && !(box.checked === true && box.getAttribute('data-was-checked') === '')) {
			const request = new XMLHttpRequest();
			const data = {
				moduleId: Number(box.getAttribute('id')),
				userId: Number(box.getAttribute('data-user-id')),
			};

			request.open('POST', `http://${server}/usermodules/${box.checked ? 'enable' : 'disable'}`, true);
			request.setRequestHeader('Content-Type', 'application/json');
			request.send(JSON.stringify(data));
		}
	});

	alert('Bot configuration saved! Redirecting you to the modules page');
	window.location.href = '/modules';

	return false;
};