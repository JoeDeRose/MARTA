document.browserType = detectBrowser();

function detectBrowser()
{
	if(document.all && window.attachEvent)
	{
		if(window.createPopup && document.releaseCapture)
		{
			if(screen.logicalXDPI && document.documentElement.ownerDocument)
				return "msie6";

			return "msie";
		}

		if(window.opera && window.addEventListener)
		{
			if(document.getElementsByTagNameNS)
				return "opera8";

			return "opera";
		}
	}
	else if(window.controllers && document.getBoxObjectFor && document.documentElement.children == null)
	{
		return "gecko";
	}

	if(document.layers)
		return "nn4";

	if(document.getElementById)
		return "w3c";

	return "other";
}

function submitDetected()
{
	var theForm = document.getElementById ? document.getElementById("frmEventRequest") : window.frmEventRequest;
	var dialect = document.getElementById ? document.getElementsByName("evd")[0] : theForm.evd;
	dialect.value = document.browserType;

	theForm.submit();
}