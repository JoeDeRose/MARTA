var formSubmitted = 'false';

function he(form, event)
{
	var vError ='';
	var vState ='return';

	if (event == 'SelectStartType')
	{		
		form.FormState.value = event;
		form.Start.value = '';
		vState = 'submit';
	}

	if (event == 'SelectEndType')
	{		
		form.FormState.value = event;
		form.End.value = '';
		vState = 'submit';
	}
 
	if (event == 'SelectStart')
	{		
		form.Start.value = form.SelectStart[form.SelectStart.selectedIndex].text;
		form.StartGeo.value = form.SelectStart[form.SelectStart.selectedIndex].value;
		vState = 'return';
	}

	if (event == 'SelectEnd')
	{		
		form.End.value = form.SelectEnd[form.SelectEnd.selectedIndex].text;
		form.EndGeo.value = form.SelectEnd[form.SelectEnd.selectedIndex].value;
		vState = 'return';
	}
	if (event == 'MatchNextBus')
	{		
		form.StopId.value = form.MatchNextBus[form.MatchNextBus.selectedIndex].value;
	}
	if (event == 'MatchOrigin')
	{		
		form.Start.value = form.MatchOrigin[form.MatchOrigin.selectedIndex].text;
		form.StartGeo.value = form.MatchOrigin[form.MatchOrigin.selectedIndex].value;
	}

	if (event == 'MatchDestination')
	{		
		form.End.value = form.MatchDestination[form.MatchDestination.selectedIndex].text;
		form.EndGeo.value = form.MatchDestination[form.MatchDestination.selectedIndex].value;
	}
	
	if (event == 'SetLocation')
	{		
		form.FormState.value = event;
		vState = 'submit';
	}

	if (event == 'SetMorningTimes')
	{		
	 	form.FromTime.value = '5:00';
		form.FromMeridian[0].checked = true;
		form.ToTime.value = '12:00';
		form.ToMeridian[1].checked = true;
	}

	if (event == 'SetAfternoonTimes')
	{		
	 	form.FromTime.value = '12:00';
		form.FromMeridian[1].checked = true;
		form.ToTime.value = '6:00';
		form.ToMeridian[1].checked = true;
	}

	if (event == 'SetEveningTimes')
	{		
	 	form.FromTime.value = '6:00';
		form.FromMeridian[1].checked = true;
		form.ToTime.value = '5:00';
		form.ToMeridian[0].checked = true;
	}

	if (event == 'SetDayTimes')
	{		
	 	form.FromTime.value = '5:00';
		form.FromMeridian[0].checked = true;
		form.ToTime.value = '4:59';
		form.ToMeridian[0].checked = true;
	}

	if (event == 'SetStops')
	{		
		form.StopCategory[2].checked = true;
	}

	if (event == 'ScheduleLookupSearch')
	{
 		if (form.LineName.value=='')
		{
			vError += 'Please enter a Route or pick from the list';
		}
	}
  
	if (event == 'HeadwaySheet')
	{
 		if (form.LineName.value=='')
		{
			vError += 'Please enter a Route or pick from the list';
		}
		form.FormState.value = event;
	}

	if (event == 'HeadwayRefresh')
	{
		vState = 'submit';
	}
	
	if (event == 'HeadwayPrint')
	{
		vState = 'submit';
	}

	if (event == 'NextBus')
	{
		vState = 'submit';
	}
	
	if (event == 'GetSchedule')
	{
		vState = 'submit';
	}

	if (event == 'TripPlanningSched')
	{
 		if (form.LineName.value=='')
		{
  			vError += 'Please enter a Route';
		}
	}

	 if (event == 'iLocationLookup')
	 {
		if (form.Start.value=='')
		{
			vError += 'Please enter a location';
		}
	}
 
	 if (event == 'iStopLookup')
	 {
 		if (form.StopNumber.value=='')
		{
			vError += 'Please enter a stop number';
		}
	}

	 if (event == 'iNextBusFind' || event == 'iNextBus' )
	{
 		if (form.StopNumber.value=='')
		{
			vError += 'Please enter a stop number, or use the location form below to find your closest stop';
		}
	}

	if (event == 'TripPlan')
	{
		if (form.End.value=='') 
		{
			vError += 'Please enter a destination\n';
		}
			
		if (form.Start.value=='')
		{
			vError += 'Please enter an origin\n';
		}
	
		if (form.End.value==form.Start.value) 
		{
			vError += 'The locations are the same\n';
		}
	
		if (vError == '')
		{
			form.FormState.value = 'Valid';
		}
	
		vState = 'submit';
	}
	
	if (vState == 'submit' && vError == '')
	{
		// block the duplicate submits
		if( formSubmitted == 'false')
		{
			formSubmitted = 'true';
			form.submit();
		}
		else
		{
			 return true;
		}
	}
	else if (vState == 'return' && vError == '')
	{ 
			return true;
	}
	else
	{
		 alert(vError);
		 return false;
	}
	
}

function setScheduleFormState(form,state)
{
	form.FormState.value = state;
	if (state == 'iHeadwaySheet')
	{
		form.StopHeadersOnly.value = '0';
	}
	else
	{
		form.StopHeadersOnly.value = '1';
	}
}

function setNextStop(id,lonlat)
{
 document.RF.SN.value = id;
 document.RF.GEO.value = lonlat;
 document.RF.submit();
	if (event == "SetNextStop")
	{		
		form.StopId.value = id;
		form.StopGeo.value = lonlat;
		document.RF.submit();
	}
}


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

