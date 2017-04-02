let url = `${process.env.API_SERVER}?`;
document.querySelectorAll('input:not[type=submit]').forEach((input, i) => {
	url += `${(i > 0 ? '&' : '') + input.id}=${input.value}`;
});

const request = new XMLHttpRequest();
request.open('GET', url, true);

request.onload = function() {
	if (request.status >= 200 && request.status < 400) {
		// Success!
		const data = JSON.parse(request.responseText);
		data.forEach((e) => {
			const li = document.createElement('li');
			li.innerHTML = `<a href=${e.id}>${e.name}</a>`;
			document.getElementById('results').appendChild(li);
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