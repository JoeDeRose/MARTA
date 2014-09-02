
evt_attachEvent(window, "load", map_start); 

function map_start()
{

	var images = document.body.getElementsByTagName("IMG");

	for(var iix = 0; iix < images.length; iix++)
	{
		var map = anc_getAncestorWithClass(images[iix], "mapcontainer");	
		map_init(map);
	}
}	

function map_init(map)
{
	if(!map || map.initialized)
		return;

	map.getZoomLevelIndex=MapNav_getZoomLevelIndex;
	map.getWindowWidth=MapNav_getWindowWidth;
	map.getWindowHeight=MapNav_getWindowHeight;	
	map.getPanOffsetX=MapNav_getPanOffsetX;
	map.getPanOffsetY=MapNav_getPanOffsetY;
	map.getDrawParams=MapNav_getDrawParams;
	map.getPrevZoomLevelIndex=MapNav_getPrevZoomLevelIndex;
	map.getPrevXOrg=MapNav_getPrevXOrg;
	map.getPrevYOrg=MapNav_getPrevYOrg;

	map.redrawMap=MapNav_redrawMap;
	map.onPlotRequestComplete=MapNav_onPlotRequestComplete;
	map.onChangeView=MapNav_onChangeView;

	map.panAbsolute=MapNav_panAbsolute;
	map.pan=MapNav_pan;
	map.panXY=MapNav_panXY;
	map.zoom=MapNav_zoom;

	map.doPanAction=MapNav_doPanAction;
	map.doZoomAction=MapNav_doZoomAction;
	map.doZoomInAction=MapNav_doZoomInAction;
        map.doCenterAction=MapNav_doCenterAction;
        map.doGeocodeAction=MapNav_doGeocodeAction;
	map.doPanMove=MapNav_doPanMove;
	map.doZoomMove=MapNav_doZoomMove;

	map.notifyControls=MapNav_notifyControls;
	map.registerControls=MapNav_registerControls;	

	var param = map.firstChild;
	map.drawService = param.value;

	param = elt_getNextElement(param, "INPUT");
	map.zoomLevelIndex = param;

	param = elt_getNextElement(param, "INPUT");
	map.zoomLevelValue = param;
	
	param = elt_getNextElement(param, "INPUT");
	map.zoomLevelArray = param.value.split(",");

	param = elt_getNextElement(param, "INPUT");
	map.wndWidthArrayX = param.value.split(",");

	param = elt_getNextElement(param, "INPUT");
	map.wndHeightArrayY = param.value.split(",");

	param = elt_getNextElement(param, "INPUT");
	map.xOrg = param;

	param = elt_getNextElement(param, "INPUT");
	map.yOrg = param;

	param = elt_getNextElement(param, "INPUT");
	map.mapCenterX = param;

	param = elt_getNextElement(param, "INPUT");
	map.mapCenterY = param;

	param = elt_getNextElement(param, "INPUT");
	map.handle = param;

	param = elt_getNextElement(param, "INPUT");
	map.mapVisibility = param;

	param = elt_getNextElement(param, "INPUT");
	map.dragAction = param;

	param = elt_getNextElement(param, "IMG");
	map.image = param;

	//param = elt_getNextElement(param);
	//map.trackingRect = param;

	param = elt_getNextElement(param, "DIV");
	map.eventSink = param;

	param = elt_getNextElement(param, "INPUT");
	map.host = param;

	param = elt_getNextElement(param, "INPUT");
	map.prevZoomLevelIndex = param;

	param = elt_getNextElement(param, "INPUT");
	map.prevXOrg = param;

	param = elt_getNextElement(param, "INPUT");
	map.prevYOrg = param;

	map.initialized = true;

	evt_attachEvent(document.body, "mouseup", map_onMapMouseUp);

	evt_attachEvent(map, "mousedown", map_onMapMouseDown);
	evt_attachEvent(map, "mousemove", map_onMapMouseMove);
	
	if(map.eventSink != null)
		map.clickMode = map.eventSink.firstChild;
		
	//map.btnParent = document.getElementById('mapNavZoomButtons_' + map.id);
		
	var zoomLevelIndex = map.getZoomLevelIndex();
	map.zoomLevelValue.value = map.zoomLevelArray[zoomLevelIndex];

	//if(map.btnParent != null) 
	//{
		//map.btnChildren = elt_getChildren(map.btnParent);

		//map.btnChildren[map.zoomLevelArray.length - zoomLevelIndex - 1].className = "map_z1";
		//var zoomLevelCount = map.zoomLevelArray.length;

		//for(var n = 0; n < zoomLevelCount; n++)
		//{
		//	var zoomLevel = map.zoomLevelArray[n];
		//	map.btnChildren[zoomLevelCount - n - 1].title =  
		//		zoomLevel == -1 ? "Full Zoom" : ("Zoom: " + zoomLevel + "(meters per device inch)");
		//
		//}
	//}		
	
	if(map.plotter)
		map.plotter.init(map.image.parentNode);
	else
		map.redrawMap();
}

function map_onImageLoaded(evt)
{
	evt = evt ? evt : window.event;

	var dragRect = MapNav_findOrCreateDragRect();
	dragRect.style.display="none";
	
	var source = evt.currentTarget ? evt.currentTarget : evt_getEventSource(evt);

	if(source.style.visibility == "visible")
	{
		source.onload = map_onImageLoaded;
		source.onmousedown = map_cancelEvent;
		source.style.top = 0;
		source.style.left = 0;

		return;
	}

	var map = anc_getAncestorWithClass(source, "mapcontainer");

	if(!map || !map.initialized)
		return;	

	map.dragStartX = null;
	map.dragStartY = null;	
	
	if(document.all)
	{
		map.image.style.top = 0;
		map.image.style.left = 0;
	}

	map.image.style.visibility = "visible";	

	if(map.mapVisibility.value != "hidden" && map.focus)
		map.focus();
			
	if(map.plotter)
		map.plotter.updateBand();
		

	if(map.oldImage != null) 
	{
		map.oldImage.parentNode.removeChild(map.oldImage);
		map.oldImage = null;
	}		
}

function map_cancelEvent(evt)
{
	evt = evt ? evt : window.event;

	if(evt)
	{
		if(evt.preventDefault)
			evt.preventDefault();

		//if(evt.stopPropagation)
		//	evt.stopPropagation()

		//evt.cancelBubble = true;
	}

	return false;
}

function map_onMapMouseDown(evt)
{
	evt = evt ? evt : window.event;
	var source = evt_getEventSource(evt);

	if (evt.stopPropagation) 
		evt.stopPropagation();

	var map = anc_getAncestorWithClass(source, "mapcontainer");

	if(!map.initialized)
		return false;	

        var eventX = evt.clientX + document.body.scrollLeft;
        var eventY = evt.clientY + document.body.scrollTop;

	var dragRect = MapNav_findOrCreateDragRect();

	dragRect.style.display="none";
	dragRect.dragContext= new Object();
	dragRect.dragContext.map = map;
	dragRect.dragContext.clientX = eventX;
	dragRect.dragContext.clientY = eventY;
	dragRect.dragContext.container = map;
	dragRect.dragContext.position = pos_getOffsetPosition(dragRect.dragContext.container);
	dragRect.dragContext.dragAction = map.dragAction.value;
	dragRect.dragContext.clickMode = map.clickMode.value;

	if(document.releaseCapture)
		dragRect.dragContext.container.setCapture();

	return false;
}

function map_onMapMouseUp(evt)
{
	evt = evt ? evt : window.event;

	var dragRect = MapNav_findOrCreateDragRect();

	if(document.releaseCapture)
		document.releaseCapture();

	if(dragRect.dragContext)
	{
		map_dragCheck(evt, dragRect.dragContext);

		if(dragRect.dragContext.map)
		{
			if(dragRect.dragContext.dragging)
				map_doDragAction(evt, dragRect.dragContext);
			else
				map_doClickAction(evt, dragRect.dragContext);

		}

		dragRect.dragContext = null;
		return;
	}

	var source = evt_getEventSource(evt);

	var map = anc_getAncestorWithClass(source, "mapcontainer");

	if(!map || !map.initialized)
		return;	

	if(map.dragStartX == null && map.plotter != null)
		map.plotter.drop(event.x, event.y, getControlKeyFlags(), map.getDrawParams());
}

function map_onMapMouseMove(evt)
{
	evt = evt ? evt : window.event;

	var dragRect = MapNav_findOrCreateDragRect();

	if(dragRect.dragContext)
	{
		map_dragCheck(evt, dragRect.dragContext);

		var map = dragRect.dragContext.map;

		//document.selection.clear();
		
		if(map.plotter && map.plotter.band.element.style.display != "none")
			map.plotter.band.track(event.x, event.y, map.image.style.pixelWidth, map.image.style.pixelHeight);
			
		if(dragRect.dragContext.dragging)
			map_doDragMove(evt, dragRect.dragContext);

		if(evt.target)
		{
			if(!evt.srcElement && evt.which == 0)
				map_onMapMouseUp(evt);
		}
		else if(evt.button == 0)
			map_onMapMouseUp(evt);	
	}		
}

function map_dragCheck(evt, dragContext)
{
	if(dragContext.dragging)
		return;

	var maxRadius = 2;
	var maxSquared = maxRadius * maxRadius;
        var eventX = evt.clientX + document.body.scrollLeft;
        var eventY = evt.clientY + document.body.scrollTop;

	var deltaX = dragContext.clientX - eventX;
	var deltaY = dragContext.clientY - eventY;
	var deltaSquared = (deltaX * deltaX) + (deltaY * deltaY);

	if(deltaSquared > maxSquared)
		dragContext.dragging = true;
}

function map_doDragAction(evt, dragContext)
{
	if(dragContext.dragAction == "pan")
		dragContext.map.doPanAction(evt);
	else if(dragContext.dragAction == "zoom")
		dragContext.map.doZoomAction(evt);
}

function map_doClickAction(evt, dragContext)
{
	if(dragContext.clickMode == "center")
		dragContext.map.doCenterAction(evt);
	else if(dragContext.clickMode == "zoom-in")
		dragContext.map.doZoomInAction(evt);
	else if(dragContext.clickMode == "geocode")
		dragContext.map.doGeocodeAction(evt); 	

//		if(bCenter) 
//		{																		
//			if(i < this.zoomLevelArray.length - 1)
//				this.panXY(dx, dy, true);
//		}

//		else if(bZoomIn) 
//		{									
//			this.panXY(dx, dy, i == 0);
//
//			if(i)
//				this.zoomIn();															
//		}				

}

function map_doDragMove(evt, dragContext)
{
	if(dragContext.dragAction == "pan")
		dragContext.map.doPanMove(evt);
	else if(dragContext.dragAction == "zoom")
		dragContext.map.doZoomMove(evt);
}

function map_onShow(evt) 
{	
	evt = evt ? evt : window.event;
	var source = evt.currentTarget ? evt.currentTarget : evt_getEventSource(evt);
	var mapid = source.getAttribute("mapid");

	if(!mapid)
		return;

	var map = document.getElementById(mapid);

	if(map && map.initialized) 
	{
		map.registerControls();
		map.mapVisibility.value = '';
		map.notifyControls(MapNav_notifyShow);

		if(map.image.parentNode.focus)
			map.image.parentNode.focus();
	}
}

function map_onHide(evt) 
{
	evt = evt ? evt : window.event;
	var source = evt.currentTarget ? evt.currentTarget : evt_getEventSource(evt);
	var mapid = source.getAttribute("mapid");

	if(!mapid)
		return;

	var map = document.getElementById(mapid);

	if(map && map.initialized) 
	{
		map.registerControls();
		map.mapVisibility.value = 'hidden';
		map.notifyControls(MapNav_notifyHide);
	}
}

function map_swapDragAction(evt) 
{
	evt = evt ? evt : window.event;
	var source = evt.currentTarget ? evt.currentTarget : evt_getEventSource(evt);

	var mapid = source.getAttribute("mapid");

	if(!mapid)
		return;

	var map = document.getElementById(mapid);

	if(map && map.initialized) 
	{
		map.registerControls();

		map.notifyControls(MapNav_notifySwapDrag);
		map.dragAction.value = map.dragAction.value == "pan" ? "zoom" : "pan";
	}
}

function map_selectClickMode(evt)
{
	evt = evt ? evt : window.event;
	var source = evt.currentTarget ? evt.currentTarget : evt_getEventSource(evt);

	var mapid = source.getAttribute("mapid");

	if(!mapid)
		return;

	var map = document.getElementById(mapid);

	if(map && map.initialized) 
	{
		map.registerControls();

		var mode = source.options[source.selectedIndex].value;

		if(map.clickMode != null)
			map.clickMode.value = mode;

		map.notifyControls(MapNav_notifyClickMode);
	}
}

function map_zoomOut(evt)
{
	evt = evt ? evt : window.event;
	var source = evt.currentTarget ? evt.currentTarget : evt_getEventSource(evt);

	var mapid = source.getAttribute("mapid");

	if(!mapid)
		return;

	var map = document.getElementById(mapid);

	if(map && map.initialized) 
	{
		// save the current view
//		map.prevZoomLevelIndex.value = map.zoomLevelIndex.value;
//		map.prevXOrg.value = map.xOrg.value;
//		map.prevYOrg.value = map.yOrg.value;
	
		map.registerControls();
		map.zoom(map.getZoomLevelIndex() + 1);
		map.notifyControls(MapNav_notifyZoom);
	}
}

function map_zoomIn(evt)
{
	evt = evt ? evt : window.event;
	var source = evt.currentTarget ? evt.currentTarget : evt_getEventSource(evt);

	var mapid = source.getAttribute("mapid");

	if(!mapid)
		return;

	var map = document.getElementById(mapid);

	if(map && map.initialized) 
	{
		// save the current view
//		map.prevZoomLevelIndex.value = map.zoomLevelIndex.value;
//		map.prevXOrg.value = map.xOrg.value;
//		map.prevYOrg.value = map.yOrg.value;

		map.registerControls();
		map.zoom(map.getZoomLevelIndex() - 1); 
		map.notifyControls(MapNav_notifyZoom);
	}
}

function map_zoom(evt)
{
	evt = evt ? evt : window.event;
	var source = evt.currentTarget ? evt.currentTarget : evt_getEventSource(evt);

	var mapid = source.getAttribute("mapid");

	if(!mapid)
		return;

	var map = document.getElementById(mapid);

	if(map && map.initialized) 
	{
		// save the current view
//		map.prevZoomLevelIndex.value = map.zoomLevelIndex.value;
//		map.prevXOrg.value = map.xOrg.value;
//		map.prevYOrg.value = map.yOrg.value;
		
		map.registerControls();
		map.zoom(source.getAttribute("level")); 
		map.notifyControls(MapNav_notifyZoom);
	}
}

function map_pan(evt, dirX, dirY)
{
	evt = evt ? evt : window.event;
	var source = evt.currentTarget ? evt.currentTarget : evt_getEventSource(evt);

	var mapid = source.getAttribute("mapid");

	if(!mapid)
		return;

	var map = document.getElementById(mapid);

	if(map && map.initialized) 
	{
		// save the current view
//		map.prevZoomLevelIndex.value = map.zoomLevelIndex.value;
//		map.prevXOrg.value = map.xOrg.value;
//		map.prevYOrg.value = map.yOrg.value;	
	
		map.registerControls();
		map.pan(dirX, dirY);
	}
}

function map_previousView(evt)
{
	evt = evt ? evt : window.event;
	var source = evt.currentTarget ? evt.currentTarget : evt_getEventSource(evt);

	var mapid = source.getAttribute("mapid");

	if(!mapid)
		return;

	var map = document.getElementById(mapid);

	if(map && map.initialized) 
	{
		// save the current view
		//var tempZoom = map.zoomLevelIndex.value;
		//var tempXOrg = map.xOrg.value;
		//var tempYOrg = map.yOrg.value;
	
		map.registerControls();
		map.zoom(map.getPrevZoomLevelIndex());
		map.notifyControls(MapNav_notifyZoom);
		map.panAbsolute(map.getPrevXOrg(), map.getPrevYOrg(), true);
		
		//map.prevZoomLevelIndex.value = tempZoom;
		//map.prevXOrg.value =  tempXOrg;
		//map.prevYOrg.value =  tempYOrg;
	}
}

function MapNav(processId, plotter)
{
	this.plotter	= plotter;
	
	// member functions


	this.cancelEvent=MapNav_cancelEvent;

	//this.onMapClick	= MapNav_onMapClick;	
	//this.onMapMouseEnter	= MapNav_onMapMouseEnter;
	//this.onMapMouseLeave	= MapNav_onMapMouseLeave;

	this.onMapKeyUp		= MapNav_onMapKeyUp;
	//this.onDrop		= MapNav_onDrop;
	//this.getDragSource	= MapNav_getDragSource;
	//this.canDrop		= MapNav_canDrop;
	//this.onDragEnd	= MapNav_onDragEnd;

	this.onShow		= MapNav_onShow;
	this.onHide		= MapNav_onHide;	
}

function MapNav_registerControls()
{
	if(this.controls)
		return;

	this.controls = [];

	var all = document.getElementsByTagName('*');

	for(var ix = 0; ix < all.length; ix++)
	{
		var anElement = all[ix];

		if(anElement.getAttribute("mapid") == this.id)
		{
			this.controls[this.controls.length]=anElement;
		}
	}
}

function MapNav_notifyControls(notifyMethod)
{
	if(!this.controls)
		return;

	for(var ix = 0; ix < this.controls.length; ix++)
	{
		var anElement = this.controls[ix];
		notifyMethod.call(this, anElement);
	}
}

function MapNav_notifyHide(aControl)
{
	var notifyHide = aControl.getAttribute("onNotifyHide");

	if(notifyHide == "hide")
		aControl.style.display = "none";
	else if(notifyHide == "show")
		aControl.style.display = "";

	// todo: extensible callback
}

function MapNav_notifyShow(aControl)
{
	var notifyShow = aControl.getAttribute("onNotifyShow");

	if(notifyShow == "hide")
		aControl.style.display = "none";
	else if(notifyShow == "show")
		aControl.style.display = "";

	// todo: extensible callback
}

function MapNav_notifySwapDrag(aControl)
{
	var notifySwapDrag = aControl.getAttribute("onNotifySwapDrag");

	if(notifySwapDrag == "setClass") 
	{
		var swapPanZoom = document.getElementById("swapPanZoom");
	
		swapPanZoom.src = this.dragAction.value == "pan" ? "FILE/Apps/System/images/maptool_zoom.gif" : "FILE/Apps/System/images/maptool_pan.gif";

//		cls_removeClassName(aControl, "map_drag_action_pan");
//		cls_removeClassName(aControl, "map_drag_action_zoom");

//		cls_putClassName(aControl, "map_drag_action_" + this.dragAction.value);
	}
	else if (notifySwapDrag == "setCursorClass")
	{
		cls_removeClassName(aControl, "mapimage_pan");
		cls_removeClassName(aControl, "mapimage_zoom");

		var cusorAction = this.dragAction.value == "pan" ? "zoom" : "pan";
		cls_putClassName(aControl, "mapimage_" + cusorAction);
	}
}

function MapNav_notifyClickMode(aControl)
{
	// doing nothing for now
}

function MapNav_notifyZoom(aControl)
{
	var notifyZoom = aControl.getAttribute("onNotifyZoom");

	if(notifyZoom == "setClass") 
	{
		var zoomLevelIndex = this.getZoomLevelIndex();
//		cls_removeClassName(aControl, "map_z0");
//		cls_removeClassName(aControl, "map_z1");

//		var btnClass = aControl.getAttribute("level") == zoomLevelIndex ? "map_z1" : "map_z0"; 
//		cls_putClassName(aControl, btnClass);
		if (aControl.getAttribute("level"))
			aControl.src = aControl.getAttribute("level") == zoomLevelIndex ? "FILE/Apps/System/images/zoom_selected.gif" : "FILE/Apps/System/images/zoom_not_selected.gif"; 

	}
}

function MapNav_getZoomLevelIndex() 
{
	return parseInt(this.zoomLevelIndex.value, 10);
}

function MapNav_getWindowWidth(i) 
{
	return parseInt(this.wndWidthArrayX[i], 10);
}

function MapNav_getWindowHeight(i) 
{
	return parseInt(this.wndHeightArrayY[i], 10);
}

function MapNav_getPanOffsetX(i) 
{
	return this.getWindowWidth(i) / 4;
}

function MapNav_getPanOffsetY(i) 
{
	return this.getWindowHeight(i) / 4;
}

function MapNav_getPrevZoomLevelIndex() 
{
	return parseInt(this.prevZoomLevelIndex.value, 10);
}

function MapNav_getPrevXOrg() 
{
	return this.prevXOrg.value;
}

function MapNav_getPrevYOrg() 
{
	return this.prevYOrg.value;
}

function uriParam(name, value) 
{
	return "&" + name + "=" + value;
}

function MapNav_getDrawParams()
{

	return 	uriParam("zoomLevel",		this.zoomLevelValue.value) +
		uriParam("xOrg", 		this.xOrg.value) +
		uriParam("yOrg",		this.yOrg.value) +
		uriParam("imageWidth",		val_getPixels(this.image.style.width)) +
		uriParam("imageHeight",		val_getPixels(this.image.style.height)) +
		uriParam("mapHandle",		this.handle.value);
}

function MapNav_redrawMap() 
{

	if(val_getPixels(this.image.style.width) > 0 && val_getPixels(this.image.style.height) > 0) 
	{
		var host = this.host ? this.host.value : "/";
		var imageUri = host + this.drawService +"?_m=GetImage" + this.getDrawParams();
		this.image.onload = map_onImageLoaded;
		this.image.onmousedown = map_cancelEvent;
		this.image.src = imageUri;
	}		
}

function MapNav_onChangeView() 
{
	if(this.plotter)
		this.plotter.refresh(getDrawParams());
	else
		this.redrawMap();
}

function MapNav_panAbsolute(panToXOrg, panToYOrg, redraw) 
{	
	this.xOrg.value = panToXOrg.toString();
	this.yOrg.value = panToYOrg.toString();

	if(redraw)
		this.onChangeView();
}

function MapNav_panXY(dx, dy, redraw) 
{	
		if(dx != 0) 
		{
			var l = parseInt(this.xOrg.value, 10);
			l = l + dx;
			this.xOrg.value = l.toString();
		}
		
		if(dy != 0) 
		{
			var l = parseInt(this.yOrg.value, 10);
			l = l + dy;
			this.yOrg.value = l.toString();
		}
		
		if(redraw && (dx != 0 || dy != 0))
			this.onChangeView();
}

function MapNav_pan(dirX, dirY) 
{
	var i = this.getZoomLevelIndex();

	if(i < this.zoomLevelArray.length - 1)
	{
		var dx;				
			
		if(dirX > 0) 
			dx = this.getPanOffsetX(i);
		else if(dirX < 0) 
			dx = -this.getPanOffsetX(i);
		else 
			dx = 0;
			
		var dy;
			
		if(dirY > 0) 
			dy = this.getPanOffsetY(i);
		else if(dirY < 0) 
			dy = -this.getPanOffsetY(i);
		else 
			dy = 0;
			
		this.panXY(dx, dy, true);
	}

}


function MapNav_zoom(i) 
{
	if(i >= 0 && i < this.zoomLevelArray.length) 
	{
		var current = this.getZoomLevelIndex();
			
		if(current != i) 
		{
			this.zoomLevelIndex.value = i.toString();
			this.zoomLevelValue.value = this.zoomLevelArray[this.getZoomLevelIndex()];
				
			if(i == this.zoomLevelArray.length - 1) 
			{

					this.xOrg.value = this.mapCenterX.value;
					this.yOrg.value = this.mapCenterY.value;
			}
				
			//if(this.btnParent != null) 
			//{
			//		var btnKids = elt_getChildren(this.btnParent)
			//		btnKids[this.zoomLevelArray.length - current - 1].className = "map_z0";
			//		btnKids[this.zoomLevelArray.length - i - 1].className = "map_z1";
			//}
								
			this.onChangeView();
		}
	}

}

function getControlKeyFlags() 
{
	var flags = 0;

	if(event.altKey) flags |= 0x1;
	if(event.ctrlKey) flags |= 0x2;
	if(event.shiftKey) flags |= 0x4;

	return flags;
}

function MapNav_onMapClick() 
{
	if(!this.eventSink)
		return;
				
	if(!this.clickMode) 
		return;
			
	var bCenter = this.clickMode.value == "center";					
	var bZoomIn = this.clickMode.value == "zoom-in";
			
	if(bCenter || bZoomIn) 
	{	
		var i = this.getZoomLevelIndex();		
		var dx = Math.round((event.x - this.image.style.pixelWidth/2) * this.getWindowWidth(i) / this.image.style.pixelWidth);
		var dy = Math.round((this.image.style.pixelHeight/2 - event.y) * this.getWindowHeight(i) / this.image.style.pixelHeight);
				
		if(bCenter) 
		{																		
			if(i < this.zoomLevelArray.length - 1)
				this.panXY(dx, dy, true);
		}
		else if(bZoomIn) 
		{									
			this.panXY(dx, dy, i == 0);

			if(i)
				this.zoomIn();															
		}
	}
	else if(this.plotter && this.clickMode.value == "__PlotterMode__") 
	{
		this.plotter.click(event.x, event.y, getControlKeyFlags(), this.getDrawParams());
	}
	else if(this.eventSink.clickFired != true) 
	{
		this.eventSink.clickFired = true;
		var i = 1;
		var x = this.eventSink.all(i++);
		var y = this.eventSink.all(i++);
		
		if(x != null && y != null) 
		{
			x.value = event.x;
			y.value = event.y;

			this.eventSink.fireEvent("onclick");			
		}
	}			
}

function MapNav_onMapMouseEnter() 
{

	if(this.initialized) 
	{		
		if(this.plotter)
			this.plotter.band.track(event.x, event.y, this.image.style.pixelWidth, this.image.style.pixelHeight);
	}	
}

function MapNav_onMapMouseLeave() 
{
	if(this.initialized) 
	{
		if(this.plotter)
			this.plotter.band.show(false);
	}
	
}

function MapNav_onPlotRequestComplete() 
{
	this.redrawMap();
}

function MapNav_doPanAction(evt)
{
	if(this.oldImage == null) 
	{
		// save the current view
//		this.prevZoomLevelIndex.value = this.zoomLevelIndex.value;
//		this.prevXOrg.value = this.xOrg.value;
//		this.prevYOrg.value = this.yOrg.value;
	
        	var eventX = evt.clientX + document.body.scrollLeft;
        	var eventY = evt.clientY + document.body.scrollTop;

		var dragRect = MapNav_findOrCreateDragRect();

		var dx = dragRect.dragContext.clientX - eventX;
		var dy = eventY - dragRect.dragContext.clientY;
							
		this.oldImage = this.image;
		this.image = this.oldImage.cloneNode(true);
	
		this.image.style.clip = "rect(auto auto auto auto)";
		this.image.style.visibility = "hidden";

		this.oldImage.parentNode.insertBefore(this.image, this.oldImage.parentNode.firstChild);

		var i = this.getZoomLevelIndex();

		var imageHeight = dragRect.dragContext.container.offsetHeight;
		var imageWidth = dragRect.dragContext.container.offsetWidth;
		var windowWidth = this.getWindowWidth(i);
		var windowHeight= this.getWindowHeight(i);

		this.panXY(windowWidth / imageWidth * dx, 
		           windowHeight / imageHeight * dy, 
		           true);										
	}
}

function MapNav_doGeocodeAction(evt)
{
        var eventX = evt.clientX + document.body.scrollLeft;
        var eventY = evt.clientY + document.body.scrollTop;

	var dragRect = MapNav_findOrCreateDragRect();

	var imageTop = dragRect.dragContext.container.offsetTop;
	var imageLeft = dragRect.dragContext.container.offsetLeft;

	var imageX = eventX - imageLeft;
	var imageY = eventY - imageTop;

alert(""+imageX+", "+imageY);

}

function MapNav_doCenterAction(evt)
{
	if(this.oldImage == null) 
	{
        	var eventX = evt.clientX + document.body.scrollLeft;
        	var eventY = evt.clientY + document.body.scrollTop;

		var dragRect = MapNav_findOrCreateDragRect();

		var imageTop = dragRect.dragContext.container.offsetTop;
		var imageLeft = dragRect.dragContext.container.offsetLeft;
		var imageHeight = dragRect.dragContext.container.offsetHeight;
		var imageWidth = dragRect.dragContext.container.offsetWidth;

		var imageCenterX = imageLeft + (imageWidth/2);
		var imageCenterY =  imageTop + (imageHeight/2);

		var dx = eventX - imageCenterX;
                var dy = imageCenterY - eventY;

		this.oldImage = this.image;
		this.image = this.oldImage.cloneNode(true);
	
		this.image.style.clip = "rect(auto auto auto auto)";
		this.image.style.visibility = "hidden";

		this.oldImage.parentNode.insertBefore(this.image, this.oldImage.parentNode.firstChild);

		var i = this.getZoomLevelIndex();

		var windowWidth = this.getWindowWidth(i);
		var windowHeight= this.getWindowHeight(i);

		this.panXY(windowWidth / imageWidth * dx, 
		           windowHeight / imageHeight * dy, 
		           true);	
	}
}

function MapNav_doZoomInAction(evt)
{
	this.doCenterAction(evt);
	this.registerControls();
	this.zoom(this.getZoomLevelIndex() - 1); 
	this.notifyControls(MapNav_notifyZoom);
}

function MapNav_doZoomAction(evt)
{
	// save the current view
//	this.prevZoomLevelIndex.value = this.zoomLevelIndex.value;
//	this.prevXOrg.value = this.xOrg.value;
//	this.prevYOrg.value = this.yOrg.value;

	var i = this.getZoomLevelIndex();
	var dragRect = MapNav_findOrCreateDragRect();
	
	dragRect.style.display="block";

	var rectTop = dragRect.dragContext.top - dragRect.dragContext.position.offsetTop;
	var rectLeft = dragRect.dragContext.left - dragRect.dragContext.position.offsetLeft;
	var rectHeight = dragRect.dragContext.height;
	var rectWidth = dragRect.dragContext.width;

	var imageHeight = dragRect.dragContext.container.offsetHeight;
	var imageWidth = dragRect.dragContext.container.offsetWidth;
	var windowWidth = this.getWindowWidth(i);
	var windowHeight= this.getWindowHeight(i);

	// rect coords are relative to the container of the image 
			
	var dx = Math.round((rectLeft + rectWidth / 2 - imageWidth / 2) * windowWidth / imageWidth);
	var dy = Math.round((imageHeight / 2 - rectTop - rectHeight / 2) * windowHeight / imageHeight);
	this.panXY(dx, dy, true);

	var zx = parseInt(this.zoomLevelArray[i], 10) * rectWidth / imageWidth;
	var zy = parseInt(this.zoomLevelArray[i], 10) * rectHeight / imageHeight;
	var maxZoom = Math.max(zx, zy);
	var closestZoomIndex = 0;
	var n;
					
	for(n = i - 1; n >= 0; n--) 
	{
		var z = parseInt(this.zoomLevelArray[n], 10);
						
			if(z < maxZoom) 
			{
				closestZoomIndex = n + 1;
				break;
			}
			else if(z == maxZoom) 
			{
				closestZoomIndex = n;
				break;
			}
	}

	this.registerControls();
	this.zoom(closestZoomIndex);
	this.notifyControls(MapNav_notifyZoom);
}



function MapNav_onDragEnd() 
{
	if(!this.initialized)
		return;

	if(this.dragStartX != null) 
	{
		var dm = this.dragAction.value;

		if(dm == "pan")
			this.doPanAction(evt);
		else if(dm == "zoom") 
			this.doZoomAction(evt);
	}	
}

function MapNav_getDragSource(dragContext)
{
	if(!this.initialized || this.dragStartX != null)
		return null;
	
	if(this.plotter && this.dragContext.dragItem == this.plotter.band.grip) 
	{
		this.plotter.dragStart();
	}
	else 
	{
		var i = this.getZoomLevelIndex();

		if(this.dragAction.value == "pan" && i == this.zoomLevelArray.length - 1)
			return null;
				
		if(this.plotter) 
		{
			this.plotter.band.show(false);
			this.plotter.band.grip.style.display = "none";
		}

		this.dragStartX = event.x;
		this.dragStartY = event.y;
	}

	return dragContext.dragSource;
}

function MapNav_canDrop() 
{
	if(!this.initialized)
		return false;

	if(this.oldImage) 
		return false;
	
	if(this.dragStartX == null) 
		return true;
		
	var dm = this.dragAction.value;
				
	if(dm == "pan") 
	{
					
		var x = event.x - this.dragStartX;
		var y = event.y - this.dragStartY;
		this.image.style.posLeft = x;
		this.image.style.posTop = y;
		this.image.style.clip = "rect(" + -y + " " + (this.image.style.pixelWidth - x) + " " + (this.image.style.pixelHeight - y) + " " + -x + ")";
		return true;
	}
				
	if(dm == "zoom") 
	{
		this.display = "";					
						
		if(event.x > this.dragStartX) 
		{
			this.trackingRect.style.posLeft = this.dragStartX;
			this.trackingRect.style.width = event.x - this.dragStartX;
		}
		else 
		{
			this.trackingRect.style.posLeft = event.x;
			this.trackingRect.style.width = this.dragStartX - event.x;
		}
						
		if(event.y > this.dragStartY) 
		{
			this.trackingRect.style.posTop = this.dragStartY;
			this.trackingRect.style.height = event.y - this.dragStartY;
		}
		else
		{
			trackingRect.style.posTop = event.y;
			trackingRect.style.height = this.dragStartY - event.y;
		}							
								
		return true;
	}
			
	return false;
}


//////////////////////

function MapNav_findOrCreateDragRect()
{
	var dragRect = document.getElementById("dragrect");

	if(dragRect)
		return dragRect;

	dragRect = document.createElement("DIV");
	dragRect.id = "dragrect";
	evt_attachEvent(dragRect, "mousemove", map_onMapMouseMove);

	document.body.appendChild(dragRect);
	return dragRect;
}

function MapNav_cancelEvent(evt)
{
	if(evt && evt.preventDefault)
		evt.preventDefault();

	return false;
}


function MapNav_doZoomMove(evt)
{
	var dragRect = MapNav_findOrCreateDragRect();

        var eventX = evt.clientX + document.body.scrollLeft;
        var eventY = evt.clientY + document.body.scrollTop;

	dragRect.style.display="block";

	if(eventY > dragRect.dragContext.clientY)
	{
		dragRect.dragContext.top = dragRect.dragContext.clientY;
		dragRect.dragContext.height = Math.min(eventY, dragRect.dragContext.position.offsetTop + dragRect.dragContext.container.offsetHeight) - dragRect.dragContext.clientY;
	}
	else
	{
		dragRect.dragContext.top = eventY;
		dragRect.dragContext.height = dragRect.dragContext.clientY - Math.max(eventY, dragRect.dragContext.position.offsetTop);
	}

	if(eventX > dragRect.dragContext.clientX)
	{
		dragRect.dragContext.left = dragRect.dragContext.clientX;
		dragRect.dragContext.width = Math.min(eventX, dragRect.dragContext.position.offsetLeft + dragRect.dragContext.container.offsetWidth) - dragRect.dragContext.clientX;			
	}
	else
	{
		dragRect.dragContext.left = eventX;
		dragRect.dragContext.width = dragRect.dragContext.clientX - Math.max(eventX, dragRect.dragContext.position.offsetLeft);			
	}
		
	//dragrect.innerHTML=""+dragRect.dragContext.top+","+dragRect.dragContext.left+","+dragRect.dragContext.height+","+dragRect.dragContext.width;
	//dragrect.innerHTML=""+dragRect.dragContext.position.offsetTop+","+dragRect.dragContext.position.offsetLeft;
	
	//var minx = Math.min(evntX, dragRect.dragContext.position.offsetLeft + dragRect.dragContext.container.offsetWidth);	
	//dragrect.innerHTML=""+dragRect.dragContext.width+","+minx+","+eventX+","+dragRect.dragContext.position.offsetLeft+","+dragRect.dragContext.container.offsetWidth+","+dragRect.dragContext.clientX;

	dragRect.dragContext.top = dragRect.dragContext.top > dragRect.dragContext.position.offsetTop ? dragRect.dragContext.top : dragRect.dragContext.position.offsetTop;
	dragRect.dragContext.left = dragRect.dragContext.left > dragRect.dragContext.position.offsetLeft ? dragRect.dragContext.left : dragRect.dragContext.position.offsetLeft;
	dragRect.style.top = dragRect.dragContext.top;
	dragRect.style.left = dragRect.dragContext.left;
	dragRect.style.height = dragRect.dragContext.height ;
	dragRect.style.width = dragRect.dragContext.width;
}


function MapNav_doPanMove(evt)
{
	var dragRect = MapNav_findOrCreateDragRect();

        var eventX = evt.clientX + document.body.scrollLeft;
        var eventY = evt.clientY + document.body.scrollTop;

	var dx = eventX - dragRect.dragContext.clientX;
	var dy = eventY - dragRect.dragContext.clientY;

	var imageHeight = dragRect.dragContext.container.offsetHeight;
	var imageWidth = dragRect.dragContext.container.offsetWidth;

	dragRect.dragContext.map.image.style.top = dy;
	dragRect.dragContext.map.image.style.left = dx;
	dragRect.dragContext.map.image.style.clip = "rect(" + -dy + " " + (imageWidth - dx) + " " + (imageHeight - dy) + " " + -dx + ")";
}

//////////////////////


function MapNav_onMapKeyUp() 
{
	if(this.plotter)
		this.plotter.keyUp(event.keyCode, this.getDrawParams());
}
