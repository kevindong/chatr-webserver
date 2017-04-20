function doSearch() {
	let url = `https://${server}/modules/search?`;
    
    //get the names 
	document.querySelectorAll('input').forEach((input, i) => {
		if (input.id !== 'author'){
             url += `${(i > 0 ? '&' : '') + input.id}=${input.value}`;  
        }
        /*if(input.id == 'author'){
            url += `${(i > 0 ? '&' : '') + input.id}=${input.value}`; 
        }*/
        
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
                
                // this displays to html 
				document.getElementById('results').appendChild(link);
			});
		} else {
			// We reached our target server, but it returned an error
			const li = document.createElement('li');
			li.innerHTML = 'There was an error! (1)';
			console.error(request);
			document.getElementById('results').appendChild(li);
		}
	};

	request.onerror = function(e) {
		// There was a connection error of some sort
		const li = document.createElement('li');
		console.error(request);
		li.innerHTML = 'There was an error! (2)';
		console.error(e);
		console.error(request.statusText);
		document.getElementById('results').appendChild(li);
	};

	request.send();

	return false;
}
