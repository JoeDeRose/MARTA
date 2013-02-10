var formSubmitted = 'false';
	
	function heQuickTrip(form, event,url){

		var vError ='';
		
		if (event == 'TripPlan')
		{	
			if (form.Start.value=='')
			{
				vError += 'Please enter a From location\n';
			}
			
			if (form.End.value=='') 
			{
				vError += 'Please enter a To location\n';
			}
			
			if (form.End.value==form.Start.value) 
			{
				vError += 'The locations are the same\n';
			}
			
			if (vError == '')
			{
				form.FormState.value = 'Valid';
			}
		
		}
		
		if (event == 'TripPlan2')
		{	
			if (form.LineAbbr.value == 0)
			{
				vError += 'Please enter a Route\n';
			}
		}
		
		if(vError == '')
		{
			if( formSubmitted == 'false')
			{
				if(event == 'TripPlan')
				{
					form.name = "TripPlan";
					form.id = "TripPlan";
					form.action=url;
					form.method = "post";
					form.target="_blank"
					document.getElementById("Date").value = document.getElementById("DateTP").value;
				}
				else if(event == 'TripPlan2')
				{
					form.name = "TripPlan2";
					form.id = "TripPlan2";
					form.action= url + "?.a=iScheduleLookup";
					form.method = "post";
					form.target="_blank"
					document.getElementById("Date").value = document.getElementById("DateSchedule").value;
				}
				//formSubmitted = 'true';
				form.submit();
			}
			else
			{
			return true;
			}
		}
		else
		{
			alert(vError);
			return false;
		}
		form.name = "purchaseCardForm";
		form.target = "_self"
	}

	function submitclick(form)
	{
		form.action = "CommuteCalculate.aspx";       
		form.method = "post";
		form.submit();
	}

	function formshowhide(id)
	{
		if(id == "atob")
		{
			document.getElementById('atob').style.display = "block";
			document.getElementById('schedules_trip').style.display = "none";
		}
		else
		{
			document.getElementById('atob').style.display = "none";
			document.getElementById('schedules_trip').style.display = "block";
		}
	}
