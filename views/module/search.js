function doSearch() {
	let url = `http://${server}/modules/search?`;
	document.querySelectorAll('input').forEach((input, i) => {
		if (input.id !== 'author') { url += `${(i > 0 ? '&' : '') + input.id}=${input.value}`; }
	});

	const request = new XMLHttpRequest();
	request.open('GET', url, true);

	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			// Success!
			const data = JSON.parse(request.responseText);
			document.getElementById('results').innerHTML = '';
			data.forEach((e) => {
				const link = document.createElement('a');
				link.className = 'list-group-item';
				link.setAttribute('href', `/modules/${e.id}`);
				link.innerText = e.name;
				document.getElementById('results').appendChild(link);
			});
		} else {
			// We reached our target server, but it returned an error
			const li = document.createElement('li');
			li.innerHTML = 'There was an error!';
			document.getElementById('results').appendChild(li);
		}
	};

	request.onerror = function() {
		// There was a connection error of some sort
		const li = document.createElement('li');
		li.innerHTML = 'There was an error!';
		document.getElementById('results').appendChild(li);
	};

	request.send();

	return false;
}