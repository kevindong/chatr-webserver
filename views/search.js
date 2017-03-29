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
			// Create an li
		});
	} else {
		// We reached our target server, but it returned an error
	}
};

request.onerror = function() {
	// There was a connection error of some sort
};

request.send();