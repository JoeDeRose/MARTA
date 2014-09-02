
function newWindow(url) {
	msgWindow=open(url,'window','scrollable=yes,resizable=yes,width=500,height=650');
	if (msgWindow.opener == null) msgWindow.opener = self;
	
	return false;	
}


function systemFeedback(referer) {
	msgWindow=open('/hiwire?.a=SystemFeedback&referer='+referer,'feedback','scrollable=yes,resizable=yes,width=500,height=650');
	if (msgWindow.opener == null) msgWindow.opener = self;
}

function LineNameOnChange()
{
 	document.ScheduleLookupSearch.LineAbbr.value=document.ScheduleLookupSearch.LineName.value;
	var la = document.ScheduleLookupSearch.LineAbbr.value;
//    alert("la is: " + la);

	if (la.indexOf("'") != -1)
	{
		la = la.replace("'","");
		document.ScheduleLookupSearch.LineAbbr.value = la;
	}
}

function LineSelectOnChange()
{
 	document.ScheduleLookupSearch.LineName.value=document.ScheduleLookupSearch.LineSelect.options[document.ScheduleLookupSearch.LineSelect.selectedIndex].text; 
	document.ScheduleLookupSearch.LineAbbr.value=document.ScheduleLookupSearch.LineSelect.options[document.ScheduleLookupSearch.LineSelect.selectedIndex].value;
}


function setLocation(form,state)
{
	document.TF.FormState.value = state;
	form.submit();
}

function setDateRange(form, range)
{
	if (range == 'M')
	{
		form.FromTime.value = '4:00';
		form.FromMeridiem[0].checked = true;
		form.ToTime.value = '12:00';
		form.ToMeridiem[1].checked = true;
	}
	else if (range == 'A')
	{
		form.FromTime.value = '12:00';
		form.FromMeridiem[1].checked = true;
		form.ToTime.value = '6:00';
		form.ToMeridiem[1].checked = true;
	}
	else if (range == 'E')
	{
		form.FromTime.value = '6:00';
		form.FromMeridiem[1].checked = true;
		form.ToTime.value = '4:00';
		form.ToMeridiem[0].checked = true;
	}
	else if (range == 'D')
	{
		form.FromTime.value = '5:00';
		form.FromMeridiem[0].checked = true;
		form.ToTime.value = '4:59';
		form.ToMeridiem[0].checked = true;
	}
	return true;
}

function setStops()
{
 document.ScheduleLookup.StopDisplay[2].checked = true;
 return true;
}

function setNextStop(id,lonlat)
{
 document.RF.SN.value = id;
 document.RF.GEO.value = lonlat;
}


function newDate(form)
{
	form.LineAbbr.value = '';
	form.LineName.value = '';
	form.alias.value = 'iScheduleLookup';
	form.submit();
	return true;
}

function checkSchedule(form, alias)
{
	var error ='';

	if (alias == 'iScheduleLookupSearch')
	{
 		if (form.LineName.value=='')
		{
		 error += 'Please enter a Route or pick from the list';
		}
        else if(form.LineAbbr.value == '' || form.LineAbbr.value == '0')
        {
            form.LineAbbr.value = form.LineName.value
        }
	}
	if (alias == 'iHeadwaySheet')
	{
 		if (form.LineName.value=='')
		{
		 error += 'Please enter a Route or pick from the list';
		}
		form.FormState.value = alias;
	}
 
 	if (error == '')
	{ 
		return true;
	}
	else
	{
		alert(error);
		return false;
	}
}
function checkNextBus(form, type,NextBusText)
{
	var error ='';
  
	if (form.NextBusText.value=='')
 	{
 	 error += 'Please enter a stop number';
 	}		

	if (type == 'iNextBusNotValid')
	{
		 if (form.NextBusText.value!=NextBusText)
		 {
				 form[".a"].value = 'iNextBusMatch';
		 }		 
	}
	if (error == '')
	{ 
		return true;
	}
	else
	{
	 alert(error);
	 return false; 
	}	

}
function checkStop(form, alias, StopKeyType)
{

	var error ='';

	if (alias == 'iLocationLookup')
	{
 		if (form.Start.value=='')
		{
		 error += 'Please enter a location';
		}

	}
 

	if (alias == 'iNextBusFind' || alias == 'iNextBus' || alias == 'iStopLookup' )
	{
		if (StopKeyType=='PublicNum')
		{
	  		if (form.PublicNum.value=='')
			{
			 error += 'Please enter a public number';
			}
		
		}
		else if (StopKeyType=='StopAbbr')
		{
	  		if (form.StopAbbr.value=='')
			{
			 error += 'Please enter a stop number';
			}
		
		}
		else
		{
	  		if (form.StopId.value=='')
			{
			 error += 'Please enter a stop number';
			}
		}
	}

 	if (error == '')
	{ 
		return true;
	}
	else
	{
		alert(error);
		return false;
	}
 
}

function submitForm(form)
{

	form.submit();
}

function doNothing()
{}

function showDate() 
{

var d=new Date()
var weekday=new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday")
var monthname=new Array("Jan.","Feb.","Mar.","Apr.","May","Jun.","Jul.","Aug.","Sep.","Oct.","Nov.","Dec.")

document.write(weekday[d.getDay()] + " - ")
document.write(monthname[d.getMonth()])
document.write(" " + d.getDate() + ", ")
document.write(d.getFullYear())
}

function printPage()
{
	if (navigator.appName == "Netscape") 
	{
       	window.print();
	}
	else
	{
	 if (confirm("Print this page?")) window.print();
	}
}

function addbookmark(bookmarkurl,bookmarktitle){
if (document.all)
window.external.AddFavorite(bookmarkurl,bookmarktitle)
}

function checkForm(form, alias)
{
	var error ='';
  
	if (alias == 'cCustomerComplaint')
	{ 			
		if (form.Incident.value=='')
		{
		 error = 'Please enter a description of the report';
		}
		if (form.FirstName.value=='')
		{	
		 error = 'Please enter your first name';
		}
		if (form.LastName.value=='')
		{		 
		 error = 'Please enter your last name';
		}	
	}

 	if (error == '')
	{ 
		return true;
	}
	else
	{
		alert(error);
		return false;
	}
}
function Instructions(Description)
{
	myWindow = window.open("", "tinyWindow", 'toolbar,width=300,height=300') ;
	myWindow.document.write(Description);
	myWindow.document.bgColor="#fffae8";
	myWindow.document.close(); 	
}
