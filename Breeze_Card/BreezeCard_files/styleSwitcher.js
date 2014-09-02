var imageUrl = '';
function setActiveStyleSheet(title) {
  var i, a, main;
  if(title =='' || title == 'null' || title == null){
  	title = 'standard';
  }
  for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
    if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
    	imageUrl = 'images/buttons/';
	    a.disabled = true;
      if(a.getAttribute("title") == title){ 
      	imageUrl = 'images/buttons/nographics/';
      	a.disabled = false;
      	}
    }
  }
  setStyleForLeftStaticMenus(title);
}

//Method to set style sheet for the left menus in the 
//Login, Forgot Password and Sign Up pages.
function setStyleForLeftStaticMenus(title){
	if(title == 'text'){
  		if(document.getElementById("graphics_div") != null){
  			document.getElementById("graphics_div").style.display = 'block';
  		}
  		if(document.getElementById("nographics_div") != null){
			document.getElementById("nographics_div").style.display = 'none';
  		}
		
		if(document.getElementById("nographics_home_div") != null){
			document.getElementById("nographics_home_div").style.display = 'none';
		}
		if(document.getElementById("graphics_home_div") != null){
			document.getElementById("graphics_home_div").style.display = 'block';
		}
		
		if(document.getElementById("nographics_benefits_div") != null){
			document.getElementById("nographics_benefits_div").style.display = 'none';
		}
		if(document.getElementById("graphics_benefits_div") != null){
			document.getElementById("graphics_benefits_div").style.display = 'block';
		}
		
		if(document.getElementById("nographics_how_div") != null){
			document.getElementById("nographics_how_div").style.display = 'none';
		}
		if(document.getElementById("graphics_how_div") != null){
			document.getElementById("graphics_how_div").style.display = 'block';
		}
		
		if(document.getElementById("nographics_faq_div") != null){
			document.getElementById("nographics_faq_div").style.display = 'none';
		}
		if(document.getElementById("graphics_faq_div") != null){
			document.getElementById("graphics_faq_div").style.display = 'block';
		}
		
		if(document.getElementById("nographics_purchase_div") != null){
			document.getElementById("nographics_purchase_div").style.display = 'none';
		}
		if(document.getElementById("graphics_purchase_div") != null){
			document.getElementById("graphics_purchase_div").style.display = 'block';
		}
		
		if(document.getElementById("nographics_group_div") != null){
			document.getElementById("nographics_group_div").style.display = 'none';
		}
		if(document.getElementById("graphics_group_div") != null){
			document.getElementById("graphics_group_div").style.display = 'block';
		}
		
		if(document.getElementById("nographics_contact_div") != null){
			document.getElementById("nographics_contact_div").style.display = 'none';
		}
		if(document.getElementById("graphics_contact_div") != null){
			document.getElementById("graphics_contact_div").style.display = 'block';
		}
		
		if(document.getElementById("nographics_partners_div") != null){
			document.getElementById("nographics_partners_div").style.display = 'none';
		}
		if(document.getElementById("graphics_partners_div") != null){
			document.getElementById("graphics_partners_div").style.display = 'block';
		}
		
		if(document.getElementById("graphics_submit_div") != null){
			document.getElementById("graphics_submit_div").style.display = 'none';
		}
		if(document.getElementById("nographics_submit_div") != null){
			document.getElementById("nographics_submit_div").style.display = 'block';
		}
		if(document.getElementById("graphics_signup_div") != null){
			document.getElementById("graphics_signup_div").style.display = 'none';
		}
		if(document.getElementById("nographics_signup_div") != null){
			document.getElementById("nographics_signup_div").style.display = 'block';
		}
		
  }else{
  		if(document.getElementById("graphics_div") != null){
			document.getElementById("graphics_div").style.display = 'none';
  		}
  		if(document.getElementById("nographics_div") != null){
			document.getElementById("nographics_div").style.display = 'block';
  		}
		
		if(document.getElementById("nographics_home_div") != null){
			document.getElementById("nographics_home_div").style.display = 'block';
		}
		if(document.getElementById("graphics_home_div") != null){
			document.getElementById("graphics_home_div").style.display = 'none';
		}
		
		if(document.getElementById("nographics_benefits_div") != null){
			document.getElementById("nographics_benefits_div").style.display = 'block';
		}
		if(document.getElementById("graphics_benefits_div") != null){
			document.getElementById("graphics_benefits_div").style.display = 'none';
		}
		
		if(document.getElementById("nographics_how_div") != null){
			document.getElementById("nographics_how_div").style.display = 'block';
		}
		if(document.getElementById("graphics_how_div") != null){
			document.getElementById("graphics_how_div").style.display = 'none';
		}
		
		if(document.getElementById("nographics_faq_div") != null){
			document.getElementById("nographics_faq_div").style.display = 'block';
		}
		if(document.getElementById("graphics_faq_div") != null){
			document.getElementById("graphics_faq_div").style.display = 'none';
		}
		
		if(document.getElementById("nographics_purchase_div") != null){
			document.getElementById("nographics_purchase_div").style.display = 'block';
		}
		if(document.getElementById("graphics_purchase_div") != null){
			document.getElementById("graphics_purchase_div").style.display = 'none';
		}
		
		if(document.getElementById("nographics_group_div") != null){
			document.getElementById("nographics_group_div").style.display = 'block';
		}
		if(document.getElementById("graphics_group_div") != null){
			document.getElementById("graphics_group_div").style.display = 'none';
		}
		
		if(document.getElementById("nographics_contact_div") != null){
			document.getElementById("nographics_contact_div").style.display = 'block';
		}
		if(document.getElementById("graphics_contact_div") != null){
			document.getElementById("graphics_contact_div").style.display = 'none';
		}
		
		if(document.getElementById("nographics_partners_div") != null){
			document.getElementById("nographics_partners_div").style.display = 'block';
		}
		if(document.getElementById("graphics_partners_div") != null){
			document.getElementById("graphics_partners_div").style.display = 'none';
		}
		
		if(document.getElementById("graphics_submit_div") != null){
			document.getElementById("graphics_submit_div").style.display = 'block';
		}
		if(document.getElementById("nographics_submit_div") != null){
			document.getElementById("nographics_submit_div").style.display = 'none';
		}
		
		if(document.getElementById("graphics_signup_div") != null){
			document.getElementById("graphics_signup_div").style.display = 'block';
		}
		if(document.getElementById("nographics_signup_div") != null){
			document.getElementById("nographics_signup_div").style.display = 'none';
		}
  }
}
function getActiveStyleSheet() {
  var i, a;
  for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
    if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title") && !a.disabled) return a.getAttribute("title");
  }
  return null;
}

function getPreferredStyleSheet() {
  var i, a;
  for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
    if(a.getAttribute("rel").indexOf("style") != -1
       && a.getAttribute("rel").indexOf("alt") == -1
       && a.getAttribute("title")
       ) return a.getAttribute("title");
  }
  return null;
}

function createCookie(name,value,days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  }
  else expires = "";
  document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

window.onload = function(e) {
  var cookie = readCookie("style");
  var title = cookie ? cookie : getPreferredStyleSheet();
//alert("title onload:::"+title);
  setActiveStyleSheet(title);
}

window.onunload = function(e) {
  var title = getActiveStyleSheet();
 // alert("title onload :::"+title);
  createCookie("style", title, 365);
}

var cookie = readCookie("style");
var title = cookie ? cookie : getPreferredStyleSheet();
setActiveStyleSheet(title);
