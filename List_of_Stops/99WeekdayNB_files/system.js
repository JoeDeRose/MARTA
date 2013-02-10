
//-- initialization section
window.offscreenBuffering = true;

//log_enable();

dfl_deferFunction(pop_showModalDialogs);

// init bound properties
dfl_deferFunction(setBoundProperties); 

//-- displays exception message details (specific to the Exception.html.uiv)
//   todo - either make it more generic or move it out of here.

function exc_details(btn) 
{
	for( var detailRow = btn.parentNode.parentNode.nextSibling;  detailRow && detailRow.nodeType != 1;  detailRow = detailRow.nextSibling );
	if( detailRow )
	{
		var isHidden = detailRow.style.display == "none";
		
		if (isHidden) 
		{
			detailRow.style.display = "";
			btn.value = "Hide";
		} 
		else 
		{
			detailRow.style.display = "none";
			btn.value = "Details...";
		}
	}
}

//-- file upload

function upload_start(uiBlock)
{
	// make sure the file name is not empty
	var inputs = uiBlock.getElementsByTagName("INPUT");

	if (inputs!=null)
	{
		var i;
		for (i=0; i < inputs.length; i++) 
		{
			var input = inputs[i];
			if( input.type == "file")
			{
				if( input.value.length == 0 )
				{
					window.alert( uiBlock.firstChild.innerText );
					input.focus();
					return false;
				}
			}
		}
	}
	
	uiBlock.style.display = "none";
	uiBlock.nextSibling.style.display = "block";
	var eventRequestForm = document.getElementById("frmEventRequest");
	eventRequestForm.encoding = "multipart/form-data";
	return true;
}

function upload_cancel(uiBlock)
{
	var eventRequestForm = document.getElementById("frmEventRequest");
	eventRequestForm.encoding = "application/x-www-form-urlencoded";
	return true;
}


function upload_command()
{
	var uiBlock = anc_getAncestorWithAttribute(evt_getEventSource(event), "upload");

	if( uiBlock )
	{
		var f = uiBlock.getAttribute("upload");
		f += "(uiBlock)";
		return eval(f);
	}
}

//-- property binding implementation

// binder context object is available within the part property getters and setters
function Binder()
{
	this.part = null;
	this.property = null;
	this.value = null;
}

// TODO
//  1) consider case when <input> values need external binding
//  2) event passing / accessing properties may be different for Mozilla


function setBoundProperties()
{
	var eventRequestForm = document.getElementById("frmEventRequest");

	if(eventRequestForm == null || eventRequestForm.boundProperties == null)
		return;

	if( document.body.binder == null)
		document.body.binder = new Binder();

	// process list of binders
	var b = eventRequestForm.boundProperties.value.split(" ");
	var i;

	for( i=0; i <  b.length; i++)
	{
		var p = document.getElementById( b[i] ); 
		if( p )
			bindProperty( p );
	}

	document.body.binder = null;
}


function bindProperty( p )
{
	// walk back the list of siblings to get the part that generated bindings
	var s = p.previousSibling;
	while( s )
	{
		if( s.nodeType == 1) // elements only
		{
			// todo - use better way to detect this sucker
			var binder= s.getAttribute("binder");
			if(binder == null)
			{
/*			
				alert( "bindProperty:" +
					"\n  id=" + s.id +  
					"\n  tagName=" + s.tagName +  
					"\n  nodeName=" + s.nodeName +
					"\n  nodeType=" + s.nodeType 
					);
*/				
				// associate bound element with the property value
				var part = s;
				p.setAttribute( "part", part ); 
				var property = p.getAttribute("property");
				if( property )
				{
					// prepare setter evaluation context
					var binder = document.body.binder;
					binder.part = part;
					binder.property = property;
					binder.value = p.value;

					var handler = p.getAttribute("init");
					var mode = p.getAttribute("binder");
					
					try
					{
						if( handler )
							eval( "part." + property + "=" + handler ); 
						else if(mode == 1)
							eval( "part." + property + "=p.value" );
					}
					catch( e )
					{
						log_enable();
						log_message( "Failed to init bound property:" +
							"\n  name=" + p.name +  
							"\n  property=" + property +  
							"\n  value=" + p.value +  
							"\n  handler=" + handler +
							"\n  error=" + e.message
							);

						log_show();
					}
				}
				
				break;
			}
		}	
		 
		s = s.previousSibling; 
	}
}

function  getBoundProperties()
{
	var eventRequestForm = document.getElementById("frmEventRequest");
	if(eventRequestForm == null || eventRequestForm.boundProperties == null)
		return;

	if( document.body.binder == null)
		document.body.binder = new Binder();

	// process list of binders
	var b = eventRequestForm.boundProperties.value.split(" ");
	var i;
	for( i=0; i <  b.length; i++)
	{
		var p = document.getElementById( b[i] ); 
		if( p )
		{
			// put 'part' object in the context of the getter expression evaluation
			var part = p.getAttribute("part");
			var property = p.getAttribute("property");
			if(part != null && property != null)
			{
				// prepare getter evaluation context
				var binder = document.body.binder;
				binder.part = part;
				binder.property = property;
				binder.value = p.value;
		
				var handler = p.getAttribute("submit");
				try
				{
					if( handler )
						p.value = eval( handler );
					else
						p.value = eval( "part." + property );	
				}
				catch( e )
				{
					log_enable();
					log_message( "Failed to submit bound property:" +
						"\n  name=" + p.name +  
						"\n  property=" + property +  
						"\n  value=" + p.value +  
						"\n  handler=" + handler +
						"\n  error=" + e.message
						);
					log_show();
				}
			}
/*		
			alert( "getBoundProperties:" +
				"\n  tagName=" + p.tagName +  
				"\n  name=" + p.name +
				"\n  value=" + p.value 
				);
*/		
		}
	}
	
	document.body.binder = null;
} 

//-- fire event back to the server

function fe_clickButtonByContent(content)
{
	var buttons = document.body.getElementsByTagName("BUTTON");

	for(var ix = 0; ix < buttons.length; ix++)
	{
		var button = buttons[ix];

		if(button.innerText == content)
		{
			button.fireEvent("onclick");
			break;
		}
	}
}

function fe_isValid(source, validationHandler)
{
	var validation = validationHandler.getAttribute("validate");
	return eval(validation);
}

function fe(event,n,p)
{
	// first check the validation on the fired event
	var source = evt_getEventSource(event);
	var validationHandler = anc_getAncestorWithAttribute(source, "validate");
	if(validationHandler && !fe_isValid(source, validationHandler))
		return;

	fe_activateBarrier();
	fe_activateLogo();

	getBoundProperties();

	// supply values for cleared check boxes
	var requester = document.getElementById("frmEventRequest");
	var inputs = requester.getElementsByTagName("INPUT");

	if (inputs!=null)
	{
		var i;
		for (i=0; i < inputs.length; i++) 
		{
			var input = inputs[i];
			if( input.type == "checkbox")
			{
				if( input.checked )
					input.value = 1;
				else	
				{
					var e = document.createElement("INPUT");
					e.type = "hidden";
					e.name = input.name;
					e.value = 0;
					requester.appendChild(e);
				}
			}
		}
	}
	
	// pack event parameters
 	if(p!=null)
	{
		var i;
		for(i=0; i<p.length-1; i+=2)
		{
			var e = document.createElement("INPUT");
			e.type = "hidden";
			e.name = 'evp_'+p[i];
			e.value = p[i+1];
			requester.appendChild(e);
		}
	}

	requester.evs.value = source ? source.name : "unknown";
	requester.evt.value = event.type;
	requester.evn.value = n;

	requester.submit();		
}

function fe_activateBarrier()
{
	var barrierFence = document.barrierFence;
	var body = document.body;

	if(!barrierFence)
	{
		barrierFence = document.createElement("DIV");
		document.barrierFence = barrierFence;			
		barrierFence.className="barrierFence";
		body.appendChild(barrierFence);
	}
}

function fe_activateLogo()
{
	var images = document.body.getElementsByTagName("IMG");

	for(var iix = 0; iix < images.length; iix++)
	{
		var image = images[iix];
		var pathTokens = image.src.split("/");
		var lastToken = pathTokens.length ? pathTokens[pathTokens.length - 1] : null;

		if("novus_logo.png" == lastToken)
		{
			image.style.filter = "progid:DXImageTransform.Microsoft.Chroma(color='white')";
			var logoContainer = image.parentNode;
			logoContainer.style.filter = "progid:DXImageTransform.Microsoft.GradientWipe(duration='0.57', motion='forward', WipeStyle='0')";
			evt_attachEvent(logoContainer, "filterchange", fe_doLogoCycle);
			fe_cycleLogo(logoContainer);	
		}
	}
}

function fe_doLogoCycle()
{
	var source = evt_getEventSource(event);
	fe_cycleLogo(source);
}

function fe_cycleLogo(theElement)
{
	theElement.phased = theElement.phased ? false : true;
	theElement.filters[0].apply();
	theElement.style.backgroundColor = theElement.phased ? "e3e3eb" : "white" ;
	theElement.filters[0].play();
}

function bl_initBodyHandler()
{
	if(document.body.bodyListeners)
		return;

	document.body.bodyListeners = [];
	evt_attachEvent(document.body, "mousedown", bl_invokeBodyHandler);
	evt_attachEvent(window, "resize", bl_invokeBodyHandler);
	evt_attachEvent(window, "scroll", bl_invokeBodyHandler);	
}

function bl_invokeBodyHandler(source)
{
	if(document.body.bodyListeners)
	{
		for(var ix = 0; ix < document.body.bodyListeners.length; ix++)
		{
			var bodyListener = document.body.bodyListeners[ix];

			if(!bodyListener || bodyListener == source)
				continue;

			if(bodyListener.doBodyEvent)
				bodyListener.doBodyEvent();
		}
	}
}

function bl_addBodyListener(bodyListener)
{
	bl_initBodyHandler();
	document.body.bodyListeners[document.body.bodyListeners.length] = bodyListener;
}

//-- utility code

//-- value handling

function val_string2boolean(value, defaultValue)
{
	if(typeof(value) == "boolean")
		return value;

	if(!value)
		return defaultValue;

	if(value.toLowerCase)
		value = value.toLowerCase();

	if(defaultValue)
		return value != "false";	
	else
		return value == "true";
}

function val_asNumber(aValue)
{
	if(aValue.split)
	{
		var ix = 0;

		while(char_isNumber(aValue.charAt(ix)) && aValue.length > ix)
			ix++;		
		
		return Number(aValue.substring(0, ix));
	}

	return aValue;
}

function val_number2ZeroPaddedString(number, size)
{
	var value = ""+number;
	var padSize = size - value.length;

	for(var pad = 0; pad < padSize; pad++)
		value = "0"+value;

	return value;
}

//-- string handling

function str_trim(stringValue)
{
	if(stringValue && stringValue.length)
	{
		var startix = 0;
		var endix = stringValue.length;

		while(char_isWhiteSpace(stringValue.charAt(startix)) && endix > startix)
			startix++;

		while(char_isWhiteSpace(stringValue.charAt(endix - 1)) && endix > startix)
			endix--;

		return stringValue.substring(startix, endix);
	}

	return stringValue; 
}

//-- char handling

function char_isNumber(charValue)
{
	switch(charValue)
	{
		case "-":
		case ".":
		case "0":
		case "1":
		case "2":
		case "3":
		case "4":
		case "5":
		case "6":
		case "7":
		case "8":
		case "9":
			return true;
	}

	return false;
}

function char_isWhiteSpace(charValue)
{
	switch(charValue)
	{
		case " ":
		case "\t":
		case "\r":
		case "\n":
			return true;
	}

	return false;
}

function evt_fire(target, evtName)
{
	if(!evtName)
		return;

	if(evtName.indexOf("on") == 0)
	{ 
		target.fireEvent(evtName);
		return;
	}

	var handler = anc_getAncestorWithAttribute(target, evtName);

	if(handler)
	{
		var value = handler.getAttribute(evtName);

		if(value && value.length)
			return eval(value);
	}
}

function evt_attachEvent(theElement, eventName, method)
{
	if(theElement.attachEvent)
		theElement.attachEvent("on"+eventName, method);
	else
		theElement.addEventListener(eventName, method, false);
}

function evt_getEventSource(event)
{
	if(event == null)
		return null;

	if(event.srcElement)
		return event.srcElement;

	var node = event.target;

	while(node && node.nodeType != node.ELEMENT_NODE)
		node = node.parentNode;

	return node;
}

//-- key handling

var key_modKeys = [];
key_modKeys["ctrl"] = true;
key_modKeys["alt"] = true;
key_modKeys["shift"] = true; 

function key_bind(binder)
{
	if(!binder)
		return;

	var part = binder.part;

	if(!part)
		return;

	var hotkeyInfo = part.hotkey;

	if(!hotkeyInfo || !hotkeyInfo.length)
		return;

	var hotkeyData = hotkeyInfo.split(",");

	for(var hix = 0; hix < hotkeyData.length; hix++)
		key_processHotkey(part, hotkeyData[hix]);
}

function key_processHotkey(part, hotkeyData)	
{
	var keyData = hotkeyData.split(" ");

	var keyAttribs = keyData[0].toLowerCase().split("-");
	var keyEvent = keyData[1];

	if(!keyEvent)
		return;

	var callback = dfl_createCallback(evt_fire, part, keyEvent);

	var keyScope = keyData[2];
	var scope = keyScope ? anc_getAncestorWithAttributeValue(part, "hotKeyScope", keyScope) : null;

	var modifierSet = [];
	var hotkey = null;
	var keyAttrib = null; 
	
	for(var kix = 0; kix < keyAttribs.length; kix++)
	{
		keyAttrib = keyAttribs[kix];

		if(key_modKeys[keyAttrib])
			modifierSet[keyAttrib] = true;
		else if(!hotkey)
			hotkey = keyAttrib; 
	}

	if(!hotkey)
		hotkey = keyAttrib; // last keyAttrib

	var modifiers = key_createModifiers(modifierSet);

	key_registerHotKey(hotkey, modifiers, callback);
}

function key_createModifiers(modifierSet)
{
	var altKey = (modifierSet["alt"] == true);
	var ctrlKey = (modifierSet["ctrl"] == true);
	var shiftKey = (modifierSet["shift"] == true);

	if(ctrlKey && altKey && shiftKey)
		modifiers = "ctrl+alt+shift";	
	else if(ctrlKey && altKey)
		modifiers = "ctrl+alt";	
	else if(ctrlKey && shiftKey)
		modifiers = "ctrl+shift";	
	else if(altKey && shiftKey)
		modifiers = "alt+shift";	
	else if(altKey)
		modifiers = "alt";
	else if(ctrlKey)
		modifiers = "ctrl";
	else if(shiftKey)
		modifiers = "shift";
	else
		modifiers = "none";

	return modifiers;
}

function key_registerHotKey(hotkey, modifiers, callback, scope)
{
	var scope = scope ? scope : window;

	if(!window.hotkeys)
	{
		dfl_deferFunction(key_hookKeyDown);
		window.hotkeys = [];
	}

	if(!scope.hotkeys)
		scope.hotkeys = [];

	var firstArg;

	if(!callback || typeof(modifiers) == "function")
	{
		firstArg = callback;
		callback = modifiers;
		modifiers = "none";
	}
	else if(modifiers && modifiers.length)
	{
		modifiers = modifiers.toLowerCase();

		var modifierList = modifiers.split("+");
	
		if(modifierList.length > 1)
		{
			var modifierSet = [];

			for(var mix = 0; mix < modifierList.length; mix++)
				modifierSet[modifierList[mix]] = true;
			
			modifiers = key_createModifiers(modifierSet);
		}
	}

	if(arguments.length > 3)
	{
		var func = callback;
		callback = new Object();
		callback.func = func;
		callback.args = [];

		if(firstArg)
			callback.args[0] = firstArg;

		for(var argix = 3; argix < arguments.length; argix++)
			callback.args[callback.args.length] = arguments[argix];
	}

	if(!scope.hotkeys[modifiers])
		scope.hotkeys[modifiers] = [];

	var key = hotkey.toUpperCase();

	if(!scope.hotkeys[modifiers][key])
		scope.hotkeys[modifiers][key] = [];

	scope.hotkeys[modifiers][key][scope.hotkeys[modifiers][key].length] = callback;
}

function key_hookKeyDown()
{
	evt_attachEvent(document.body, "keydown", key_interceptKeyDown);
}

function key_getKey(keyCode, shiftKey)
{
	var key;

	switch(keyCode)
	{
		case 8:
			key = "backspace";
			break;		
		case 9:
			key = "tab";
			break;
		case 12:
			key = "middle";
			break;		
		case 13:
			key = "return";
			break;		
		case 16:
			key = "shift";
			break;		
		case 17:
			key = "ctrl";
			break;		
		case 18:
			key = "alt";
			break;				
		case 20:
			key = "capslock";
			break;				
		case 27:
			key = "esc";
			break;		
		case 32:
			key = "space";
			break;
		case 33:
			key = "pageup";
			break;
		case 34:
			key = "pagedown";
			break;
		case 35:
			key = "end";
			break;
		case 36:
			key = "home";
			break;
		case 37:
			key = "left";
			break;
		case 38:
			key = "up";
			break;
		case 39:
			key = "right";
			break;
		case 40:
			key = "down";
			break;	
		case 45:
			key = "insert";
			break;		
		case 46:
			key = "delete";
			break;
		case 48: // 0
			key = shiftKey ? ")": "0";
			break;
		case 49: // 1
			key = shiftKey ? "!": "1";
			break;
		case 50: // 2
			key = shiftKey ? "@": "2";
			break;
		case 51: // 3
			key = shiftKey ? "#": "3";
			break;
		case 52: // 4
			key = shiftKey ? "$": "4";
			break;
		case 53: // 5
			key = shiftKey ? "%": "5";
			break;
		case 54: // 6
			key = shiftKey ? "^": "6";
			break;
		case 55: // 7
			key = shiftKey ? "&": "7";
			break;
		case 56: // 8
			key = shiftKey ? "*": "8";
			break;
		case 57: // 9
			key = shiftKey ? "(": "9";
			break;
		case 91: // start
			key = "start";
			break;
		case 93: // windows
			key = "windows";
			break;
		case 96: // numlock 0
		case 97: // numlock 1
		case 98: // numlock 2
		case 99: // numlock 3
		case 100: // numlock 4
		case 101: // numlock 5
		case 102: // numlock 6
		case 103: // numlock 7
		case 104: // numlock 8
		case 105: // numlock 9
			key = ""+(keyCode - 96);			
			break;
		case 106:
			key = "*";
			break;		
		case 107:
			key = "plus";
			break;		
		case 109:
			key = "minus";
			break;		
		case 110:
			key = ".";
			break;
		case 111:
			key = "/";
			break;
		case 112:
		case 113:
		case 114:
		case 115:
		case 116:
		case 117:
		case 118:
		case 119:
		case 120:
		case 121:
		case 122:
		case 123:
			key = "f"+(keyCode - 111);
			break;			
		case 144:
			key = "numlock";
			break;
		case 186:
			key = shiftKey ? ":" : ";";
			break;
		case 187:
			key = shiftKey ? "plus" : "=";
			break;
		case 188:
			key = shiftKey ? "<" : ",";
			break;
		case 189:
			key = shiftKey ? "_" : "minus";
			break;
		case 190:
			key = shiftKey ? ">" : ".";
			break;
		case 191:
			key = shiftKey ? "?" : "/";
			break;
		case 192:
			key = shiftKey ? "`" : "~";
			break;
		case 219:
			key = shiftKey ? "[" : "{";
			break;
		case 220:
			key = shiftKey ? "|" : "\\";
			break;
		case 221:
			key = shiftKey ? "]" : "}";
			break;
		case 222:
			key = shiftKey ? "\"" : "'";
			break;
		default:
			key = String.fromCharCode(keyCode);
			break;		
	}

	return key.toUpperCase();
}

function key_isShiftedKey(keyCode)
{
	if(keyCode > 47 && keyCode < 58) // keyCodes 48-57
		return true;

	if(keyCode > 185 && keyCode < 193) // keyCodes 186-192
		return true;

	if(keyCode > 218 && keyCode < 223) // keyCodes 219-222
		return true;

	return false;
}

function key_interceptKeyDown()
{
	var key = key_getKey(event.keyCode, event.shiftKey);
	
	var modifiers = "none";

	if(event.ctrlKey && event.altKey && event.shiftKey)
		modifiers = "ctrl+alt+shift";	
	else if(event.ctrlKey && event.altKey)
		modifiers = "ctrl+alt";	
	else if(event.ctrlKey && event.shiftKey)
		modifiers = "ctrl+shift";	
	else if(event.altKey && event.shiftKey)
		modifiers = "alt+shift";	
	else if(event.altKey)
		modifiers = "alt";
	else if(event.ctrlKey)
		modifiers = "ctrl";
	else if(event.shiftKey)
		modifiers = "shift";	

	var source = evt_getEventSource(event);
	var scope = anc_getAncestorWithHotKey(source, key, modifiers);

	var hadCallbacks = key_callCallback(scope,  key, modifiers);

	if(hadCallbacks)
		scope = window;

	var shifted = event.shiftKey ? key_isShiftedKey(event.keyCode) : false;

	if(shifted)
	{	
		if(event.ctrlKey && event.altKey)
			modifiers = "ctrl+alt";		
		else if(event.altKey)
			modifiers = "alt";
		else if(event.ctrlKey)
			modifiers = "ctrl";
		else
			modifiers = "none";

		scope = scope ? scope : anc_getAncestorWithHotKey(source, key, modifiers);

		if(key_callCallback(scope, key, modifiers))
			hadCallbacks = true;
	}

	if(hadCallbacks)
	{
		event.cancelBubble = true;
		event.returnValue=false;
	}
}

function key_callCallback(scope, key, modifiers)
{
	var callbacks = key_scopeGetCallbacks(scope, key, modifiers);

	var count = callbacks ? callbacks.length : 0;

	for(var ix = 0; ix < count; ix++)
		dfl_callCallback(callbacks[ix]);

	return callbacks != null;
}

function key_scopeGetCallbacks(scope, key, modifiers)
{
	scope = scope ? scope : window;
	var registry = scope.hotkeys ? scope.hotkeys[modifiers] : null;
	return registry ? registry[key] : null;
}

// deferred function

function dfl_createCallback(callback)
{
	if(arguments.length > 1)
	{
		var func = callback;
		callback = new Object();
		callback.func = func;
		callback.args = [];

		for(var argix = 1; argix < arguments.length; argix++)
			callback.args[callback.args.length] = arguments[argix];
	}

	return callback;
}

function dfl_deferFunction(callback)
{
	callback = dfl_createCallback.apply(null, arguments);
	
	if( document.body && !document.deferred)
	{
		dfl_callCallback(callback)
		return;
	}

	dfl_init();

	document.deferred[document.deferred.length] = callback; 
}

function dfl_init()
{
	if(document.deferred || document.body)
		return;

	document.deferred = [];

	evt_attachEvent(window, "load", dfl_callDeferred); 
}

function dfl_callDeferred()
{
	if(!document.deferred || !document.deferred.length)
		return;
		
	for(var ix = 0; ix < document.deferred.length; ix++)
		dfl_callCallback(document.deferred[ix])

	document.deferred = null;
}

function dfl_callCallback(callback)
{
	if(callback == null)
		return;

	if(typeof(callback) == "string")
		eval(callback);
	else if(typeof(callback) == "object")
		callback.func.apply(null, callback.args);
	else if(typeof(callback) == "function") 
		callback();
}

//-- logging

var log_messageIndex = 0;
var log_messageIdSeparator = ":&nbsp;";
var log_reversed = false;

function log_enable()
{
	log_create();
	key_registerHotKey("l", "alt", log_toggleDisplay);
	key_registerHotKey("c", "alt", log_clear);
	dfl_deferFunction(log_create, "a", "b");

	//dfl_deferFunction(log_create);
}

function log_message(message)
{
	var raw = "<span class=\"logindex\">" + log_messageIndex + log_messageIdSeparator +"</span>";

	if(message)
		raw += "<span class=\"logmessage\">" + message + "</span>";

	log_raw(raw); 
	log_messageIndex++;
}

function log_event(theEvent, message)
{
	var raw = "<span class=\"logindex\">" + log_messageIndex + log_messageIdSeparator + "</span>";

	if(theEvent)
		raw += "<span class=\"logevent\">&lt;"+theEvent.type+"&gt;</span>";

	if(theEvent && message)
		raw += "&nbsp;";

	if(message)
		raw += "<span class=\"logmessage\">"+message+"</span>";

	log_raw(raw); 
	log_messageIndex++;
}

function log_exception(theException, message)
{
	var raw = "<span class=\"logindex\">" + log_messageIndex + log_messageIdSeparator + "</span>";

	if(theException)
		raw += "<span class=\"logexception\">*" + theException.name + "*</span>";

	if(theException && (message || theException.message))
		raw += "&nbsp;";

	if(message)
		raw += "<span class=\"logmessage\">" + message + "</span>";
	else if(theException && theException.message)
		raw += "<span class=\"logmessage\">" + theException.message + "</span>";

	log_raw(raw); 
	log_messageIndex++;
}

function log_raw(raw)
{
	var divText = "<div class=\"logentry\">" + raw + "</div>";
	
	if(document.logger && log_reversed)
	{
		document.logger.innerHTML = divText + document.logger.innerHTML;
	}
	else if(document.logger)
	{
		document.logger.innerHTML += divText;
		document.logger.scrollTop = document.logger.scrollHeight
	}
	
}

function log_clear()
{
	if(document.logger)
		document.logger.innerHTML = "";

	log_messageIndex = 0;
}

function log_toggleDisplay()
{
	if(log_isDisplayed())
		log_hide();
	else
		log_show();
}

function log_isDisplayed()
{
	return document.logger ? document.logger.currentStyle.display != "none" : false;
}

function log_show()
{
	if(document.logger)
		document.logger.style.display = "block";
}

function log_hide()
{
	if(document.logger)
		document.logger.style.display = "none";
}

function log_create()
{
	var logOutput = document.getElementById("logoutput");

	if(!logOutput)
	{
		if(document.logger)
			logOutput = document.logger;
		else
			logOutput = document.createElement("<div id='logoutput' />");

		if(document.body)
			document.body.appendChild(logOutput);
		
		document.logger=logOutput;
	}	
}

//-- class management

function cls_putClassName(theElement, className)
{
	if(theElement.className == null)
	{
		theElement.className = className;
		return true;
	}

	if(cls_hasClassName(theElement, className))
	{
		return false;
	}


	theElement.className += " "+className;
	return true;
}

function cls_removeClassName(theElement, className)
{
	if(theElement == null || theElement.className == null)
		return false;

	var classNames = theElement.className.split(" ");
	var spliced = false;

	for(var ix = classNames.length - 1; ix >= 0; ix--)
	{
		if(classNames[ix] == className)
		{
			classNames.splice(ix, 1);
			spliced = true;
		}
	}

	if(spliced)
	{
		theElement.className = classNames.join(" ");
		return true;
	}

	return false;
}

function cls_hasClassName(theElement, className)
{
	if(theElement == null || theElement.className == null)
		return false;

	var classNames = theElement.className.split(" ");

	for(var ix = 0; ix < classNames.length; ix++)
	{
		if(classNames[ix] == className)
			return true;
	}

	return false;
}

//-- ancestor discovery

function anc_isAncestor(theElement, thePotentialAncestor)
{
	for(var ancestor = theElement; ancestor; ancestor = ancestor.parentNode)
	{
		if(ancestor.getAttribute == null)
			return false;

		if(ancestor == thePotentialAncestor)
			return true;		
	}

	return false;
}

function anc_getAncestorByTagName(theElement, tagName, limit)
{
	for(var ancestor = theElement; ancestor; ancestor = ancestor.parentNode)
	{
		if(limit && ancestor.tagName == limit)
			return null;

		if(ancestor.getAttribute == null)
			return null;

		if(ancestor.tagName == tagName)
			return ancestor;		
	}

	return null;
}

function anc_getAncestorWithStyle(theElement, styleName, limit)
{
	for(var ancestor = theElement; ancestor; ancestor = ancestor.parentNode)
	{
		if(limit && ancestor.tagName == limit)
			return null;

		if(ancestor.getAttribute == null)
			return null;

		if(ancestor.style.getAttribute(styleName))
			return ancestor;		
	}

	return null;
}

function anc_getAncestorWithAttribute(theElement, attributeName, limit)
{
	for(var ancestor = theElement; ancestor; ancestor = ancestor.parentNode)
	{
		if(limit && ancestor.tagName == limit)
			return null;

		if(ancestor.getAttribute == null)
			return null;

		if(ancestor.getAttribute(attributeName))
			return ancestor;		
	}

	return null;
}

function anc_getAncestorWithAttributeValue(theElement, attributeName, attributeValue, limit)
{
	for(var ancestor = theElement; ancestor; ancestor = ancestor.parentNode)
	{
		if(limit && ancestor.tagName == limit)
			return null;

		if(ancestor.getAttribute == null)
			return null;

		if(ancestor.getAttribute(attributeName) == attributeValue)
			return ancestor;		
	}

	return null;
}

function anc_getAncestorWithHotKey(theElement, key, modifiers, limit)
{
	for(var ancestor = theElement; ancestor; ancestor = ancestor.parentNode)
	{
		if(limit && ancestor.tagName == limit)
			return null;

		if(ancestor.getAttribute == null)
			return null;

		if(key_scopeGetCallbacks(ancestor, key, modifiers))
			return ancestor;		
	}

	return null;
}

function anc_getAncestorWithClass(theElement, className, limit)
{
	for(var ancestor = theElement; ancestor; ancestor = ancestor.parentNode)
	{
		if(limit && ancestor.tagName == limit)
			return null;

		if(ancestor.getAttribute == null)
			return null;

		if(cls_hasClassName(ancestor, className))
			return ancestor;		
	}

	return null;
}

function anc_isCurrentlyDisplayed(theElement)
{
	for(var ancestor = theElement; ancestor; ancestor = ancestor.parentNode)
	{
		if(ancestor.getAttribute == null)
			return "true";

		if(ancestor.currentStyle.display == "none")
			return false;
	}

	return "true";
}

//-- component parameters

function prm_getParameter(theElement, parameterName)
{
	prm_initParameters(theElement);

	return theElement.parameters ? theElement.parameters[parameterName] : null;
}

function prm_initParameters(theElement)
{
	if(theElement.parameters)
		return;

	theElement.parameters = [];

	var parameterSets = theElement.getElementsByTagName("H1");
	

	for(var lix = 0; lix < parameterSets.length; lix++)
	{
		if(parameterSets[lix].className == "parameterSet")
		{
			var parameterSet = parameterSets[lix];

			var parameters = parameterSet.getElementsByTagName("INPUT");
	
			for(var pix = 0; pix < parameters.length; pix++)
			{
				var parameter = parameters[pix];
				theElement.parameters[parameter.id] = parameter;
			}
	
			break;
		} 
	}
}

//-- mutex

function mux_prepare(theElement, csv)
{
	if(theElement.mux && theElement.mux.count > 0)
		return false;
 
	if(!theElement.mux)
		theElement.mux = new Object();

	var values = csv.split(","); 
	theElement.mux.count = values.length;
	theElement.mux.keys = [];

	for(var ix = 0; ix < theElement.mux.count; ix++)
	{
		var key = values[ix];
		theElement.mux.keys[key] = true;
	}
}

function mux_release(theElement, key)
{
	if(theElement.mux && theElement.mux.count > 0)
	{
		if(theElement.mux.keys[key])
		{
			theElement.mux.keys[key] = false;
			theElement.mux.count--;
		}

		return theElement.mux.count < 1;
	}

	return true;
}

//-- element positioning

function pos_getOffsetLeft(theElement, referenceElement)
{
	var offsetLeft = theElement.offsetLeft  - theElement.scrollLeft;
	var offsetParent = theElement.offsetParent;

	if(!offsetParent)
		return offsetLeft;

	if(referenceElement && offsetParent == referenceElement)
		return offsetLeft;

	if(theElement.offsetParent.tagName == "BODY")
	{
		if(referenceElement)
			offsetLeft -= pos_getOffsetLeft(referenceElement);

		return offsetLeft;
	}

	offsetLeft += pos_getOffsetLeft(offsetParent, referenceElement);

	return offsetLeft; 
}

function pos_getOffsetTop(theElement, referenceElement)
{
	var offsetTop = theElement.offsetTop - theElement.scrollTop;
	var offsetParent = theElement.offsetParent;

	if(!offsetParent)
		return offsetTop;

	if(referenceElement && offsetParent == referenceElement)
		return offsetTop;

	if(theElement.offsetParent.tagName == "BODY")
	{
		if(referenceElement)
			offsetTop -= pos_getOffsetTop(referenceElement);

		return offsetTop;
	}

	offsetTop += pos_getOffsetTop(offsetParent, referenceElement);

	return offsetTop; 
}

function pos_getOffsetPosition(theElement, referenceElement)
{
	var offsetPosition = new Object();
	offsetPosition.offsetTop = theElement.offsetTop - theElement.scrollTop;
	offsetPosition.offsetLeft= theElement.offsetLeft - theElement.scrollLeft;

	var offsetParent = theElement.offsetParent;

	if(!offsetParent)
		return offsetPosition;

	if(referenceElement && offsetParent == referenceElement)
		return offsetPosition;

	if(theElement.offsetParent.tagName == "BODY")
	{
		if(referenceElement)
		{
			var referencePosition = pos_getOffsetPosition(referenceElement);
			offsetPosition.offsetTop -= referencePosition.offsetTop;
			offsetPosition.offsetLeft -= referencePosition.offsetLeft;
		}

		return offsetPosition;
	}

	var parentPosition = pos_getOffsetPosition(offsetParent, referenceElement);

	offsetPosition.offsetTop += parentPosition.offsetTop;
	offsetPosition.offsetLeft += parentPosition.offsetLeft;

	return offsetPosition; 
}

//-- popup support


function pop_showModalDialogs()
{
	var modalFence = document.modalFence;

	if(!modalFence)
	{
		modalFence = document.getElementById("modalFence");
		document.modalFence = modalFence;		
	}

	if(!modalFence)
		return;

	var top = 200;
	var left = 200;

	for(var modalDialog = modalFence.nextSibling; modalDialog; modalDialog = modalDialog.nextSibling)
	{
		if(cls_hasClassName(modalDialog, "modalDialog"))
		{
			if(modalFence.style.display != "block")
				modalFence.style.display = "block";

			modalDialog.style.display = "block";
			modalDialog.style.top = top;
			modalDialog.style.left = left;
			
			var kids = modalDialog.all;

			for(var kidx = 0; kidx < kids.length; kidx++)
			{
				var kid = kids[kidx];

				if(kid.doDisplayChanged)
					kid.doDisplayChanged();

			}
		}

		top += 20;
		left += 20;
	}

	pop_attachPopup(document); // ensure the popup fence exists
}

function pop_attachPopup(theDocument, newPopup)
{
	var popupFence = theDocument.popupFence;
	var body = theDocument.body;

	if(!popupFence)
	{
		popupFence = theDocument.getElementById("popupFence");
		theDocument.popupFence = popupFence;		
	}

	if(!popupFence)
	{
		popupFence = theDocument.createElement("DIV");
		theDocument.popupFence = popupFence;		
		popupFence.style.display = "none";
		body.appendChild(popupFence);
	}

	if(newPopup)
		body.insertBefore(newPopup, popupFence.nextSibling);
}

// -- transfer support

function xfer_setTransferElement(transferElement)
{
	if(!transferElement)
		return null;

	var uniqueID = transferElement.uniqueID;
	xfer_setTransferObject(uniqueID, transferElement);
	return uniqueID;
}

function xfer_getTransferElement(uniqueID)
{
	return xfer_getTransferObject(uniqueID);
}

function xfer_setTransferObject(key, transferObject)
{
	var body = document.body;

	if(body.transferObjects == null)
		body.transferObjects = [];

	body.transferObjects[new String(key)] = transferObject;
}

function xfer_getTransferObject(key)
{
	var body = document.body;
	return 	body.transferObjects ? body.transferObjects[new String(key)] : null;
}

// -- spin support

function spin_cycle(spinID)
{
	var spinElement = xfer_getTransferElement(spinID);
	spinElement.spinCounter += 1;

	var counter = spinElement.spinCounter;
	var timerID = spinElement.spinTimerID;
	var widget = spinElement.widget ? spinElement.widget : spinElement;

	if(spinElement.spinStop)
		window.clearInterval(timerID);


	spin_callCallback(spinElement.spinCallback, spinElement, widget, spinID, counter, timerID);
}

function spin_callCallback(callback, spinElement, widget, spinID, counter, timerID)
{
	if(callback == null)
		return;

	if(typeof(callback) == "string")
		eval(callback);
	else if(typeof(callback) == "object")
		callback.func.apply(null, callback.args);
	else if(typeof(callback) == "function") 
		callback();
}

function spin_stopSpin(spinElement)
{
	spinElement.spinStop = true;
}

function spin_doSpin(spinElement, callback)
{
	spinElement.spinCallback = callback;
	spinElement.spinCounter = 0;
	spinElement.spinStop = false;
	spinElement.spinID = xfer_setTransferElement(spinElement);
	spinElement.spinTimerID = window.setInterval("spin_cycle('"+spinElement.spinID+"')", 1);
}

// -- ISO date support

function iso_getIsoDay(isoDate)
{
	return isoDate.substr(6, 2);
}

function iso_getIsoMonth(isoDate)
{
	return isoDate.substr(4, 2);
}

function iso_getIsoYear(isoDate)
{
	return isoDate.substr(0, 4);
}

function iso_getDay(isoDate)
{
	var isoDay = iso_getIsoDay(isoDate);
	return iso_isoDay2Day(isoDay);
}

function iso_isoDay2Day(isoDay)
{
	var day = new Number(isoDay);
	return day.valueOf();
}

function iso_getMonth(isoDate)
{
	var isoMonth = iso_getIsoMonth(isoDate);
	return iso_isoMonth2Month(isoMonth);		
}

function iso_isoMonth2Month(isoMonth)
{
	var monthNumber = new Number(isoMonth);
	var month = monthNumber.valueOf();
	month--;
	return month;
}

function iso_getYear(isoDate)
{
	var isoYear = iso_getIsoYear(isoDate);
	return iso_isoYear2Year(isoYear);
}

function iso_getDayOfWeek(isoDate)
{
	return iso_isoDate2Date(isoDate).getDay();
}

function iso_isoYear2Year(isoYear)
{
	var year = new Number(isoYear);
	return year.valueOf();
}

function iso_isoDate2Date(isoDate)
{
	if(!isoDate || isoDate.length == 0)
		return null;

	try
	{
		var dateString = iso_getIsoMonth(isoDate) + "/" +iso_getIsoDay(isoDate) + "/" + iso_getIsoYear(isoDate);		
		return new Date(dateString);
	}
	catch(e)
	{
	}

	return null;
}

function iso_date2isoDate(date)
{
	if(!date)
		return null;

	var isoYear = val_number2ZeroPaddedString(date.getFullYear(), 4);	
	var isoMonth = val_number2ZeroPaddedString(date.getMonth() + 1, 2); 
	var isoDay = val_number2ZeroPaddedString(date.getDate(), 2); 
	
	return isoYear+isoMonth+isoDay;
}