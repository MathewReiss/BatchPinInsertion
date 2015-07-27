//=========================================================================================================================
// Batch Pin Insertion/Deletion Timeline Library (Mathew Reiss)
//=========================================================================================================================

// Bool for testing in DEBUG mode
var DEBUG = true;

// The timeline public URL root
var API_URL_ROOT = 'https://timeline-api.getpebble.com/';

// Arrays for temporarily storing pins to be inserted and pins to be deleted
var INSERT_PINS = [], DELETE_PINS = [];

/**
 * Send a request to the Pebble public web timeline API.
 *
 * Iterating through both arrays is placed inside the Pebble.getTimelineToken function,
 * as attempting to process a significant number of pins one-at-a-time can cause
 * issues in behavior (namely, getTimelineToken is asynchronous).
 */
function timelineRequest() {
  Pebble.getTimelineToken(function(token) {
	var pin, url, xhr;

	if(DEBUG) console.log("Inserting " + INSERT_PINS.length + " pin(s); Deleting " + DELETE_PINS.length + " pin(s).");

	for(var i = 0, i_len = INSERT_PINS.length; i < i_len; i++){
		pin = INSERT_PINS[i];
		url = API_URL_ROOT + 'v1/user/pins/' + pin.id;
		xhr = new XMLHttpRequest();
		
		if(DEBUG) console.log("Insert Pin: " + pin.id + " @ " + pin.time);
	
		xhr.open('PUT', url);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('X-User-Token', '' + token);
		xhr.send(JSON.stringify(pin));
	}
	INSERT_PINS = []; //Clear array
	
	for(var d = 0, d_len = DELETE_PINS.length; d < d_len; d++){
		pin = DELETE_PINS[d];
		url = API_URL_ROOT + 'v1/user/pins/' + pin.id;
		xhr = new XMLHttpRequest();
		
		if(DEBUG) console.log("Delete Pin: " + pin.id + " @ " + pin.time);
	
		xhr.open('DELETE', url);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('X-User-Token', '' + token);
		xhr.send(JSON.stringify(pin));
	}
	DELETE_PINS = []; //Clear array

  }, function(error) { console.error('Timeline: Error getting timeline token: ' + error); });
}

/**
 * Add a pin to the INSERT_PINS array, queued for later
 * @param pin The JSON pin to insert.
 */
function insertUserPin(pin) {
	if(DEBUG) console.log("Pin added to Insertion array: " + pin.id);
	INSERT_PINS.push(pin);
}

/**
 * Add a pin to the DELETE_PINS array, queued for later
 * @param pin The JSON pin to delete.
 */
function deleteUserPin(pin) {
	if(DEBUG) console.log("Pin added to Deletion array: " + pin.id);
	DELETE_PINS.push(pin);
}

/**
 * Begin processing pins in both arrays
 */
function releasePins(){
	if(DEBUG) console.log("Pins released...");
	timelineRequest();
}

//=========================================================================================================================
