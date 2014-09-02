function popitup(url) {
	newwindow=window.open(url,'name','height=380,width=400');
	if (window.focus) {newwindow.focus()}
	return false;
}