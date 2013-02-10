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

function val_getPixels(pixelValue)
{
	if(pixelValue.split)
		return Number(pixelValue.split("px")[0]);

	return pixelValue;
}

function elt_getNextElement(anElement, tagName)
{
	for(anElement = anElement.nextSibling; anElement != null; anElement = anElement.nextSibling)
	{
		if(anElement.nodeType == 1)
		{
			if( tagName )
			{
				if( anElement.tagName == tagName )
				{
					return anElement;
				}
			}
			else
			{
				return anElement;
			}
		}
	}

	return null;
}

function elt_getChildren(anElement)
{
	var children = [];
	

	for(var aChild = anElement.firstChild; aChild; aChild = aChild.nextSibling)
	{
		if(aChild.nodeType == 1)
			children[children.length] = aChild;
	} 

	return children;	
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