
/******************************* CSS Switcher (start)************************************/

function checkForGraphicsTest(isGraphic){
	if(isGraphic == 'true'){
		document.getElementById('cssId').innerHTML = "<link id='cssLink' rel='Stylesheet'  type='text/css' href='../css/gui.css' />";
			return true;
	}else if(isGraphic == 'false'){
		document.getElementById('cssId').innerHTML = "<link id='cssLink' rel='Stylesheet'  type='text/css' href='../css/nographics.css' />";	
			return false;
	}

}

var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari"
		},
		{
			prop: window.opera,
			identity: "Opera"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};
BrowserDetect.init();


function changeStyleSheet(toWhat){
			if(BrowserDetect.browser=='MSIE'){
				if(toWhat == 'text'){
					if (document.styleSheets[0].href != null) {
						document.styleSheets[0].href = "calendar_nographics.css";
					}			
					if (document.styleSheets[1].href != null) {
						document.styleSheets[1].href = "css/nographics.css";
					}
				}else{
					if (document.styleSheets[0].href != null) {
						document.styleSheets[0].href = "calendar.css";
					}			
					if (document.styleSheets[1].href != null) {
						document.styleSheets[1].href = "css/gui.css";
					}
				}
			}else if(BrowserDetect.browser=='Firefox'){
			
				var linkTag, linkTitle = toWhat;
				var linksArray = document.getElementsByTagName("link");
			
				for(var linkNum=0; linkNum<linksArray.length; linkNum++) {
					linkTag = linksArray[linkNum];
					if(linkTag.getAttribute("rel").match(/^sty|^alt/i)) {
			
						if (linkTag.getAttribute("title") == linkTitle) {
							linkTag.disabled = false;
						} else if (linkTag.getAttribute("title")) {
							linkTag.disabled = true;
						}
			
					}
				}								
			
			} 
			
		}
/************************************ CSS Switcher (end) ************************************************/


	function validateText(objValue,strRegExp){
		
		if(objValue == null){
			
			return false;
		}
		if(trimString(objValue).length == 0){
			
			return false;
		}
		
	    var charpos = objValue.search(strRegExp);
	    
	    if(objValue.length > 0 &&  charpos >= 0)
	    {
	      	
	      	return false;
	    }
	    
	 return true;
	}

	function trimString(sInput)
	{
	    while(''+sInput.charAt(0)==' ')
	    {
	        sInput=sInput.substring(1,sInput.length);
	    }
	    while(''+sInput.charAt(sInput.length-1)==' ')
	    {
	        sInput=sInput.substring(0,sInput.length-1);
	    }
	    return sInput;
	}
