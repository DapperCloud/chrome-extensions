function runParsing(callback) {
	let phoneButtonQuery = "div[data-qa-id='adview_button_phone_contact'] button";
	if (document.querySelector(phoneButtonQuery)) {
		console.log("phone button found");
		document.querySelector(phoneButtonQuery).click();
		window.setTimeout(function() {
			callback(parsePage());
		}, 500);
	} else {
		console.log("phone button not found");
		callback(parsePage());
	}
}

function parsePage() {
	let titleBlock = document.querySelector("div[data-qa-id='adview_title']").innerText.split("\n");
	let phoneQuery = "div[data-qa-id='adview_button_phone_contact']";
	let phoneNumber = document.querySelector(phoneQuery) ? document.querySelector(phoneQuery).innerText.split("\n")[0] : "?";

    return {
    	appartement: titleBlock[0],
    	loyer: titleBlock[1] + (titleBlock[2] == "Charges comprises" ? " CC" : ""),
    	surface: document.querySelector("div[data-qa-id='criteria_item_square']").innerText.split("\n")[1].split(" ")[0],
    	contacts: phoneNumber ? phoneNumber : "?"
    }
}

runParsing(function(data) {
	chrome.runtime.sendMessage({
		action: "getSource",
		source: data
	});
});