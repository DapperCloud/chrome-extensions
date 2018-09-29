 let sendToSpreadsheet = document.getElementById('sendToSpreadsheet');
 var url = "?";

sendToSpreadsheet.onclick = function(element) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		url = tabs[0].url;
		chrome.tabs.executeScript(null, { 
			file: "lbcparser.js"
		}, function() {
			// If you try and inject into an extensions page or the webstore/NTP you'll get an error
			if (chrome.runtime.lastError) {
				console.error('There was an error injecting script : \n' + chrome.runtime.lastError.message);
			}
		});
	});
};

chrome.runtime.onMessage.addListener(function(request, sender) {
	if (request.action == "getSource") {
		let data = request.source;
		copyTextToClipboard([data.appartement, data.adresse, data.loyer, data.honoraires, data.dateDispo, data.surface, data.chambres, data.description, url, data.contacts, 3, 3, 3, 3, "ERR"].join("\t"));
		
	}
});


// https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
function copyTextToClipboard(text) {
	var textArea = document.createElement("textarea");

	//
	// *** This styling is an extra step which is likely not required. ***
	//
	// Why is it here? To ensure:
	// 1. the element is able to have focus and selection.
	// 2. if element was to flash render it has minimal visual impact.
	// 3. less flakyness with selection and copying which **might** occur if
	//    the textarea element is not visible.
	//
	// The likelihood is the element won't even render, not even a flash,
	// so some of these are just precautions. However in IE the element
	// is visible whilst the popup box asking the user for permission for
	// the web page to copy to the clipboard.
	//

	// Place in top-left corner of screen regardless of scroll position.
	textArea.style.position = 'fixed';
	textArea.style.top = 0;
	textArea.style.left = 0;

	// Ensure it has a small width and height. Setting to 1px / 1em
	// doesn't work as this gives a negative w/h on some browsers.
	textArea.style.width = '2em';
	textArea.style.height = '2em';

	// We don't need padding, reducing the size if it does flash render.
	textArea.style.padding = 0;

	// Clean up any borders.
	textArea.style.border = 'none';
	textArea.style.outline = 'none';
	textArea.style.boxShadow = 'none';

	// Avoid flash of white box if rendered for any reason.
	textArea.style.background = 'transparent';


	textArea.value = text;

	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();

	try {
		var successful = document.execCommand('copy');
		var msg = successful ? 'successful' : 'unsuccessful';
		document.getElementById("notifBox").innerHTML = "\\o/ tu peux aller copier dans une nouvelle ligne";
	} catch (err) {
		document.getElementById("notifBox").innerHTML = "ERREUR DUKU!";
	}

	document.body.removeChild(textArea);
}