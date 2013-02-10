//PURCHASE BREEZE CARD

function callAddMoneyToCards(){
		var url = "purchaseCard.do?dispatchTo=addCheckOutCart";
		document.forms[0].action = url;
		document.forms[0].method = "POST";
		document.forms[0].submit();
	
	}

function hotlisted(){
	alert("This Breeze Card has been deactivated, please contact MARTA for more information ");

}
function expiry(){
	
	alert("This Breeze Card has expired, please contact MARTA for more information");
}

	var tabEntryCount ;
	//To display and hide the corresponding div for the tab functionality
	function modifyDisplayTabData(showDiv, cartDetails, isFromNext, cart_cardId_addId){		
		
		if(cartDetails != '' && cartDetails != '0'){		
			if(showDiv == ''){
				showDiv = 'purchaseCardDiv';
			}	
			if(showDiv == 'purchaseCardDiv' ){
				var url = "breezeCardAction.do?dispatchTo=buyCards&&chageName=yes";
				document.forms[0].action = url;
				document.forms[0].method = "POST";
				document.forms[0].submit();
			}			
			tabLocation = showDiv;	
			if(showDiv == 'addMoneyToCartDiv' ){
				if(document.getElementById('breezeCardId'))	{		
				if(document.getElementById('breezeCardId').value == '0'){					
					divId = document.getElementById('productDetailsDivID');
				if(divId){
					divId.style.display='none';
				}	
				}
				}else{				
					var url = "breezeCardAction.do?dispatchTo=purchaseCard";
					document.forms[0].action = url;
					document.forms[0].method = "POST";
					document.forms[0].submit();
				}	
			}	
			if(showDiv == 'myCartDiv' ){							
				var url = "breezeCardAction.do?dispatchTo=myCart";
				document.forms[0].action = url;
				document.forms[0].method = "POST";
				document.forms[0].submit();
			}							
			if(showDiv == 'recur_thrDiv' ){							
				var url = "recurringThresholdAction.do?dispatchTo=recuringThreshold";
				document.forms[0].action = url;
				document.forms[0].method = "POST";
				document.forms[0].submit();
			}							
			if(showDiv == 'shippingDiv' && isFromNext != 'fromNext' && isFromNext == 'false'){	
				alert('Shipping detail is empty. ')
				 	return;			
			}
			if(showDiv == 'shippingDiv' && isFromNext == 'showEditAddress'){	
				 	displayEditAddress('true',cart_cardId_addId);				 	
				 	
				 var url = "breezeCardAction.do?dispatchTo=showShippingDetails&isShippingAddressEdit=true";
				document.forms[0].action = url;
				document.forms[0].method = "POST";
				document.forms[0].submit();		
			}else if(showDiv == 'shippingDiv'){
				var url = "breezeCardAction.do?dispatchTo=showShippingDetails";
				document.forms[0].action = url;
				document.forms[0].method = "POST";
				document.forms[0].submit();	
			}
					
			if(showDiv == 'paymentMethodDiv' && isFromNext == 'false' ){
				alert('Payment detail is empty ')
				return;
			}
			else if(showDiv == 'paymentMethodDiv' && isFromNext == 'showEditAddress'){
					displayEditCard('true',cart_cardId_addId);					
				var url = "breezeCardAction.do?dispatchTo=showPaymentDetails&isBillingAddressEdit=true";
				document.forms[0].action = url;
				document.forms[0].method = "POST";
				document.forms[0].submit();			 	
				 	
			}else if(showDiv == 'paymentMethodDiv'){
				var url = "breezeCardAction.do?dispatchTo=showPaymentDetails";
				if(cart_cardId_addId=='')
					url +="&isBillingAddressEdit=true"; 
				document.forms[0].action = url;
				document.forms[0].method = "POST";
				document.forms[0].submit();	
			}
					
			if(showDiv == 'reviewOrderDiv' && isFromNext != 'fromNext' && isFromNext == 'false' ){
				alert('Cannot review order till completion of purchase flow.')
				 	return;
			
			}else if(showDiv == 'reviewOrderDiv' && isFromNext == 'true'){
				var url = "breezeCardAction.do?dispatchTo=showReviewOrder";
				document.forms[0].action = url;
				document.forms[0].method = "POST";
				document.forms[0].submit();	
			}
			
					
			document.getElementById('purchaseCardDiv').style.display = 'none';
			document.getElementById('addMoneyToCartDiv').style.display = 'none';
			document.getElementById('myCartDiv').style.display = 'none';	
			document.getElementById('shippingDiv').style.display = 'none';
			document.getElementById('paymentMethodDiv').style.display = 'none';
			document.getElementById('reviewOrderDiv').style.display = 'none';
			document.getElementById('confirmationDiv').style.display = 'none';
			document.getElementById(showDiv).style.display = '';
		
		}
		else{
			alert('Your shopping cart is empty. Please add a card in your cart');
		}
	
	}
	
	//To display edit address div
	function displayEditAddress(editAddress,cart_cardId_addId){
		if(editAddress == 'true'){
			if(document.getElementById('shipToNewAddressTR')){
				document.getElementById('shipToNewAddressTR').style.display = '';
			}
			if(cart_cardId_addId != '0' && cart_cardId_addId != '-1'
				 	            && cart_cardId_addId != '')	{
				 	      if(document.getElementById('addressId')){
				 			document.getElementById('addressId').value = cart_cardId_addId;
				 			}
				 	}else{	
				 		  if(document.getElementById('addressId')){			 	
				 	 		document.getElementById('addressId').disabled = true;
					 	 	}
					 	 if(document.getElementById('shipToNewAddress')){
					 		document.getElementById('shipToNewAddress').checked = true;
					 		
				 		}
				 	}
		}
		else if(editAddress == 'new'){
			if(document.getElementById('shipToNewAddressTR')){
				document.getElementById('shipToNewAddressTR').style.display = '';
				document.forms[0].shipToNewAddress.checked = "true";
			}
		}
	}
	
	//To display edit address div
	function displayEditCard(editCard,cart_cardId_addId){
		if(editCard == 'true'){
			if(document.getElementById('showNewPaymentTR')){
				document.getElementById('showNewPaymentTR').style.display = '';					
			}
			if(document.getElementById('billingAddresseName') &&
					    document.getElementById('billingAddresseName').value != '' ){
						document.getElementById('newBillingAddressTR').style.display = '';
					}
					if(cart_cardId_addId != null){
					if(cart_cardId_addId >0 && document.getElementById('paymentCardId')!=null && document.getElementById('paymentCardId').selectedIndex != 0)	{
					      if(document.getElementById('paymentCardId')){				                 
					 		document.getElementById('paymentCardId').value = cart_cardId_addId;
				 			}
				 	}else{
				 	    if(document.getElementById('paymentCardId')){
					 	 document.getElementById('paymentCardId').disabled = true;	
					 	}
					 	if(document.getElementById('payFromNewCard')){		 	 
				 	 	document.getElementById('payFromNewCard').checked = true;
				 	 	}
				 	 	if(document.getElementById('billingAddresseName')){
					 		if(document.getElementById('billingAddresseName').value != ''){
					 		  if(document.getElementById('billingAddressId')){
					 			document.getElementById('billingAddressId').disabled = true;	
					 			}
					 			 if(document.getElementById('newBillingAddressChk')){		 	 
					 			document.getElementById('newBillingAddressChk').checked = true;
					 			}
					 		}
				 		}
				 	}
			}
		}	
	}
	
	function removeNL(s) {

    	r = "";
		  for (i=0; i < s.length; i++) {
		    if (s.charAt(i) != '\n' &&
		        s.charAt(i) != '\r' &&
		        s.charAt(i) != '\t') {
			    r += s.charAt(i);
		      }
    	  }
  		return r;
  	}
	var cardId = '';
	
		//poulate product for a region
		function populateregionDetails(selectedRegionId){
			regionId = selectedRegionId;
			cardId = document.getElementById('breezeCardId').value;
			if(regionId != '' && regionId != '0'){
				moneyVal = document.getElementById('moneyValue').value;
				if(moneyVal != '' && (isNaN(moneyVal) || (moneyVal*1 <= 0))){
				 alert('Please enter valid cash value');
				 document.getElementById('regionId').value = currRegionId;
				 return;
				}		
				var url = "breezeCardAction.do?dispatchTo=getProductDetailsForBCard&regionId="+regionId+"&tabLocation=addMoneyToCartDiv&cardId="+cardId;
				document.forms[0].action = url;
				document.forms[0].method = "POST";
				document.forms[0].submit();
			}
			else{
			}
		}

		//Populate card data onselect
		function populatecardDetails(selectedcardId,isAvailable){
		    var confirmNext = true;
		    moneyVal = document.getElementById('moneyValue').value;
		   // if(isAvailable != '' && isAvailable == 'true') {
		     //  confirmNext= confirm('You have not added the selected products in cart. Do you want'+
			//													 ' to continue?'); 
			//	if(confirmNext == false){
			//		document.getElementById('breezeCardId').value=currBCardId;
			//	}
			
		//	}
			if(confirmNext == true){
					cardId = selectedcardId;
					if(cardId != '' && cardId != '0'){
						//if(isNaN(moneyVal) || (moneyVal*1 <= 0)){
							document.getElementById('moneyValue').value = "";
						//}			
						var url = "breezeCardAction.do?dispatchTo=getProductDetailsForBCard&cardId="+cardId+"&tabLocation=addMoneyToCartDiv&regionId=0";
						document.forms[0].action = url;
						document.forms[0].method = "POST";
						document.forms[0].submit();
					}
					else{
						/*if(document.getElementsByName('productDetailsDiv')){
						var productDetailsTR = document.getElementsByName('productDetailsDiv');
							for(var i = 0; i <productDetailsTR.length; i++){
								productDetailsTR[i].style.display = 'none';
							}
						}
						*/
						
						divId = document.getElementById('productDetailsDivID');
						if(divId){
							divId.style.display='none';
						}
						document.getElementById("displayCardDetailsDiv").style.display="none";
					}
			}	
		}
		
		//Populate card data onselect
		function addToCartNew(tabLocatn,AVAILABLE_CASH_VALUE,avaialableProducts,avaialbleProdIdArr,collectionProducts){
			var  noOfProduct = '0';
		    var addMoney = '';
		    var upperLimit = document.getElementById("upperLimit");
		    var reStr = document.getElementById("reStr");
		 //   alert(upperLimit.value);
			if(document.getElementById('breezeCardId')){
				cardId = document.getElementById('breezeCardId').value ;
			}
			//alert(cardId);
			var selectedIds = '';
			if(cardId != '' && cardId != '0'){
			
				if(document.getElementsByName('productChk')){
					var productChks = document.getElementsByName('productChk');					
					for(var productCount=0; productCount<productChks.length; productCount++){
						if(productChks[productCount].checked == true || 
								productChks[productCount].checked == 'checked'){
							if(selectedIds != ''){
								selectedIds += ',';
							}
							selectedIds = selectedIds + productChks[productCount].id;
						}
					}				
				}	
				//alert('avaialableProducts'+avaialableProducts);	
				//alert('selectedIds'+selectedIds);
				
				for (var i=0; i < document.purchaseCardForm.moneyValue.length; i++){
   					if (document.purchaseCardForm.moneyValue[i].checked){
   						addMoney = document.purchaseCardForm.moneyValue[i].value;
				     }
				}
				if( parseInt(avaialableProducts) >=0){	
					if(parseInt(collectionProducts)== 0 && (selectedIds == '' && addMoney == '')){
					alert('Please add cash or select a product before adding the card in cart');
					return;
				}
				else{
					//If selected products count is more than 4 - return
					if(selectedIds != ''){
						var selectedIdsArr = selectedIds.split(',');
					//	var avaialbleProdIdArr = '';
						for(var selectedIdNum=0; selectedIdNum<selectedIdsArr.length; selectedIdNum++) {
							selectedProddetails1 = selectedIdsArr[selectedIdNum];
							selectedProdId1 = selectedProddetails1.split("_");
						
							    productIdSelected1 = selectedProdId1[3];
							    reCount = 0;
							    for(var j=0;j < avaialableProducts;j++ ){
									
								       if(avaialbleProdIdArr[j] == productIdSelected1 ){
								    	   
								    	   reCount=reCount+1;
								    	   
								       }
									}
							    
							    avaialableProducts = avaialableProducts - reCount;
							 
						}
						var selectedProdID = '';
					//	if(avaialableProducts != '') {
						//  avaialbleProdIdArr = avaialableProducts.split(',');
					//	}
					//	alert(avaialbleProdIdArr);
			
						
						if(null != selectedIdsArr && selectedIdsArr != ''){
							AVAILABLE_CASH_VALUE = AVAILABLE_CASH_VALUE *1;
							if(AVAILABLE_CASH_VALUE > 0){
								
								if((selectedIdsArr.length+parseInt(avaialableProducts)) > 5){
									//alert('Selected number of products should not exceed 4.');
									alert('Maximum number of products allowed on a Breeze Card should not exceed four.')
									return;
								}
							}else{
								isThisCash = '';
								 for(var selectedIdNum=0; selectedIdNum<avaialbleProdIdArr.length; selectedIdNum++) {
									
									selectedProdId = avaialbleProdIdArr[selectedIdNum];
									//alert('selectedProdId'+selectedProdId);
									isThisCash = selectedProdId;
									//alert('isThisCash'+isThisCash);
									if(isThisCash == 32769){
									//alert("fdf");
										break;
									}
						    	 }	
						    	if(isThisCash == '32769'){
						    		if((selectedIdsArr.length+parseInt(avaialableProducts.length)) > 5){
										//alert('Selected number of products should not exceed 4.');
										alert('Maximum number of products allowed on a Breeze Card should not exceed four.')
										return;
									}
						    	}else{ 
									if((selectedIdsArr.length+parseInt(avaialableProducts.length)) > 4){
										//alert('Selected number of products should not exceed 4.');
										alert('Maximum number of products allowed on a Breeze Card should not exceed four.')
										return;
									}
								}
							}
							   
						//	alert(reStr.value);	 
							var temp = new Array();
							temp = reStr.value.split(",")
						
							for(var selectedIdNum=0; selectedIdNum<selectedIdsArr.length; selectedIdNum++) {
								selectedProddetails = selectedIdsArr[selectedIdNum];
								selectedProdId = selectedProddetails.split("_");
							
								    productIdSelected = selectedProdId[3];
								    var count = 0; 
								   
								    for(var avaialbleIdNum=0; avaialbleIdNum<avaialbleProdIdArr.length; ++avaialbleIdNum) {
										availableProdId = avaialbleProdIdArr[avaialbleIdNum];
										//alert('productIdSelected:'+productIdSelected+'availableProdId:'+availableProdId);
									//	alert(temp[avaialbleIdNum]);
										if(null != temp[avaialbleIdNum] ){
										cID = temp[avaialbleIdNum].split("-");
										
										if(parseInt(cID[1]) == parseInt(productIdSelected)  ){
										//	alert(cID[1])
											count = count+parseInt(cID[0])
										}
										}
										if(parseInt(productIdSelected) == parseInt(availableProdId) ) {
										   
											count = count + 1; 
										 
										//	alert(count+upperLimit.value);
										
										    if(parseInt(count)> parseInt(upperLimit.value)){
										   alert(selectedProdId[1]+'  already exists more than the allowed limit on this card, cannot add again.');
										    return;
											}
										}	
										
									}
								    
							}	
						}
					}
				    }
				    }
					if(document.getElementById('selectedProducts')){
						document.getElementById('selectedProducts').value = selectedIds;
					}	
					if(addMoney != ''){
					var moneyVal = addMoney;
					
						if(isNaN(moneyVal) || (moneyVal*1 <= 0)){
						    alert('Please enter valid cash value');
						    return;
						}
							
						//To convert values into numbers
						moneyVal = moneyVal*1;
						AVAILABLE_CASH_VALUE = AVAILABLE_CASH_VALUE *1;
						
						if((moneyVal+AVAILABLE_CASH_VALUE) > 100){							
							alert('Maximum cash allowed on Breeze Card is $100.');
							return;
						}
					}
					//To check all new cards for their presence in the
					//shopping cart.
					//alert('tabLocatn'+tabLocatn);
					if(tabLocatn == 'myCartDiv'){
					//alert('insidetabLocatn'+tabLocatn);
						var newCards = getAllNickNames();
						var cartItems = document.getElementById('cart_cards');
						if(newCards != ''){
							if(null != cartItems){
								//var cartItemArr = cartItems.value.split(',');
								var newCardsArr = newCards.split(',');								
								//iterate through card ids
								for(var i=0;i<newCardsArr.length;i++){
									if(cartItems.value.indexOf("NewCard"+i) == -1 && cardId != "NewCard"+i){
										var confirmSave= confirm('You have not added all the new cards in cart. Do you want'+
																 ' to continue?');  			
										if(confirmSave != true){
											return;
										}else{
											break;
										}
									}
								}//for loop - card ids ends						
							}//null check for cart items - ends
						}//if new card count is not 0.
					}
					//alert('outsidetabLocatn'+tabLocatn);
							var url = "breezeCardAction.do?dispatchTo=getProductDetailsForBCard&cardId="+cardId+"&tabLocation="+tabLocatn+"&userAction=addToCart";
							document.forms[0].action = url;
							document.forms[0].method = "POST";
							document.forms[0].submit();									
				}
			
			else{
				alert('Please select a card');			
				divId = document.getElementById('productDetailsDivID');
				if(divId){
					divId.style.display='none';
				}
			}		
		}
		
		
		
		//Populate card data onselect
		function addToCart(tabLocatn,AVAILABLE_CASH_VALUE,avaialableProducts,avaialbleProdIdArr,collectionProducts){
			var  noOfProduct = '0';
		    var addMoney = '';
			if(document.getElementById('breezeCardId')){
				cardId = document.getElementById('breezeCardId').value ;
			}
			//alert(cardId);
			var selectedIds = '';
			if(cardId != '' && cardId != '0'){
			
				if(document.getElementsByName('productChk')){
					var productChks = document.getElementsByName('productChk');					
					for(var productCount=0; productCount<productChks.length; productCount++){
						if(productChks[productCount].checked == true || 
								productChks[productCount].checked == 'checked'){
							if(selectedIds != ''){
								selectedIds += ',';
							}
							selectedIds = selectedIds + productChks[productCount].id;
						}
					}				
				}	
				//alert('avaialableProducts'+avaialableProducts);	
				//alert('selectedIds'+selectedIds);
				
				for (var i=0; i < document.purchaseCardForm.moneyValue.length; i++){
   					if (document.purchaseCardForm.moneyValue[i].checked){
   						addMoney = document.purchaseCardForm.moneyValue[i].value;
				     }
				}
				if( parseInt(avaialableProducts) >=0){	
					if(parseInt(collectionProducts)== 0 && (selectedIds == '' && addMoney == '')){
					alert('Please add cash or select a product before adding the card in cart');
					return;
				}
				else{
					//If selected products count is more than 4 - return
					if(selectedIds != ''){
						var selectedIdsArr = selectedIds.split(',');
						//var avaialbleProdIdArr = '';
						var selectedProdID = '';
						//if(avaialableProducts != '') {
						//  avaialbleProdIdArr = avaialableProducts.split(',');
						//}
						if(null != selectedIdsArr && selectedIdsArr != ''){
							AVAILABLE_CASH_VALUE = AVAILABLE_CASH_VALUE *1;
							if(AVAILABLE_CASH_VALUE > 0){
								if((selectedIdsArr.length+parseInt(avaialableProducts)) > 5){
									//alert('Selected number of products should not exceed 4.');
									alert('Maximum number of products allowed on a Breeze Card should not exceed four.')
									return;
								}
							}else{
								isThisCash = '';
								 for(var selectedIdNum=0; selectedIdNum<avaialbleProdIdArr.length; selectedIdNum++) {
									
									selectedProdId = avaialbleProdIdArr[selectedIdNum];
									//alert('selectedProdId'+selectedProdId);
									isThisCash = selectedProdId;
									//alert('isThisCash'+isThisCash);
									if(isThisCash == 32769){
									//alert("fdf");
										break;
									}
						    	 }	
						    	if(isThisCash == '32769'){
						    		if((selectedIdsArr.length+parseInt(productNames.length)) > 5){
										//alert('Selected number of products should not exceed 4.');
										alert('Maximum number of products allowed on a Breeze Card should not exceed four.')
										return;
									}
						    	}else{ 
									if((selectedIdsArr.length+parseInt(productNames.length)) > 4){
										//alert('Selected number of products should not exceed 4.');
										alert('Maximum number of products allowed on a Breeze Card should not exceed four.')
										return;
									}
								}
							}
							for(var selectedIdNum=0; selectedIdNum<selectedIdsArr.length; selectedIdNum++) {
								selectedProddetails = selectedIdsArr[selectedIdNum];
								selectedProdId = selectedProddetails.split("_");
							
								    productIdSelected = selectedProdId[3];
									for(var avaialbleIdNum=0; avaialbleIdNum<avaialbleProdIdArr.length; ++avaialbleIdNum) {
										availableProdId = avaialbleProdIdArr[avaialbleIdNum];
										//alert('productIdSelected:'+productIdSelected+'availableProdId:'+availableProdId);
										var count = 0; 
										if(parseInt(productIdSelected) == parseInt(availableProdId) ) {
										    //count = count + 1; 
											//if(count>=2){
										    alert(selectedProdId[1]+'  already exists'+count+'in this card, cannot add again.');
										 return;
											//}
										}
									}
								
							}	
						}
					}
				    }
				    }
					if(document.getElementById('selectedProducts')){
						document.getElementById('selectedProducts').value = selectedIds;
					}	
					if(addMoney != ''){
					var moneyVal = addMoney;
					
						if(isNaN(moneyVal) || (moneyVal*1 <= 0)){
						    alert('Please enter valid cash value');
						    return;
						}
							
						//To convert values into numbers
						moneyVal = moneyVal*1;
						AVAILABLE_CASH_VALUE = AVAILABLE_CASH_VALUE *1;
						
						if((moneyVal+AVAILABLE_CASH_VALUE) > 100){							
							alert('Maximum cash allowed on Breeze Card is $100.');
							return;
						}
					}
					//To check all new cards for their presence in the
					//shopping cart.
					//alert('tabLocatn'+tabLocatn);
					if(tabLocatn == 'myCartDiv'){
					//alert('insidetabLocatn'+tabLocatn);
						var newCards = getAllNickNames();
						var cartItems = document.getElementById('cart_cards');
						if(newCards != ''){
							if(null != cartItems){
								//var cartItemArr = cartItems.value.split(',');
								var newCardsArr = newCards.split(',');								
								//iterate through card ids
								for(var i=0;i<newCardsArr.length;i++){
									if(cartItems.value.indexOf("NewCard"+i) == -1 && cardId != "NewCard"+i){
										var confirmSave= confirm('You have not added all the new cards in cart. Do you want'+
																 ' to continue?');  			
										if(confirmSave != true){
											return;
										}else{
											break;
										}
									}
								}//for loop - card ids ends						
							}//null check for cart items - ends
						}//if new card count is not 0.
					}
					//alert('outsidetabLocatn'+tabLocatn);
							var url = "breezeCardAction.do?dispatchTo=getProductDetailsForBCard&cardId="+cardId+"&tabLocation="+tabLocatn+"&userAction=addToCart";
							document.forms[0].action = url;
							document.forms[0].method = "POST";
							document.forms[0].submit();									
				}
			
			else{
				alert('Please select a card');			
				divId = document.getElementById('productDetailsDivID');
				if(divId){
					divId.style.display='none';
				}
			}		
		}		
		
		
		//To add card nicknames in buy card page to add money to card page 
		//in the card name select box
		function addNicknamesToCombo(tabLocation, cartDetails){
			//populatecardDetails('0');
			//var nickNames = getAllNickNames();
			if(document.getElementById("cardNickNames")){				
				document.getElementById("cardNickNames").value = nickNames;				
			}		
			
			/*if(document.getElementsByName('productDetailsDiv')){
				var productDetailsTR = document.getElementsByName('productDetailsDiv');
					for(var i = 0; i <productDetailsTR.length; i++){
						productDetailsTR[i].style.display = 'none';
					}
			}
			*/
			
			divId = document.getElementById('productDetailsDivID');			
			if(divId){			
				divId.style.display='none';
			}
			//alert('nickNames'+nickNames);
			//if(nickNames != '' && nickNames != 'invalid'){				
				url = "breezeCardAction.do?dispatchTo=purchaseCard&tabLocation="+tabLocation+"&userAction=populateCardNickNames";
				document.forms[0].action = url;
				document.forms[0].method = "POST";
				document.forms[0].submit();
			//}
			//else if(nickNames == ''){			
			//	alert('please enter nickname');
			//}
		}
		
	//Edit payment details from the payment page in purchase cards
	//The method redirects to the manage payment action to edit
	//the selected card
	function editPaymentCards(fromPage){
		if(document.getElementById('paymentCardId')){
			var paymentId = document.getElementById('paymentCardId').value;
			document.getElementById('isActive').value = "0";
			var editAddVar = document.forms[0].editAddress.value;
			var url = '';
			if(paymentId != '' && paymentId != '-1'){				
				url = 'managePaymentcardAction.do?dispatchTo=getPaymentCardForEdit&editAdd='+editAddVar+'&editPaymentCardId='+paymentId+
						'&returnValue='+fromPage;
				document.forms[0].action = url;
				document.forms[0].method = "POST";
				document.forms[0].submit();		
			}else{
				document.getElementById("invalidpaymentCardId").innerHTML ='Please choose a card';
			}
		}
	}
	//To create dynamic controls for card nick name
		function addBreezeCards(){
		var numOfRows;
		if(document.forms[0].cardCount.value != null && document.forms[0].cardCount.value.length > 0){
			if(!validateText(document.forms[0].cardCount.value, "[^0-9]") || document.forms[0].cardCount.value == '0' || document.forms[0].cardCount.value == '00'){
				alert("Please enter valid number of cards you want to purchase.");
				document.forms[0].cardCount.focus();
				return false;
			}
			numOfRows = parseInt(document.forms[0].cardCount.value);
			}
		else{			
			alert("Please enter number of cards you want to purchase.");
			document.forms[0].cardCount.focus();
			return false;
		}
		if( numOfRows > maxCardToBuy ){
			alert("Please enter the number of cards '"+ maxCardToBuy+"' or less.");
			document.forms[0].cardCount.select();
			document.forms[0].cardCount.focus();
			return false;
		}

		var tablebody = document.getElementById('bcNickNameTable');
		var tableRowCount = 2;
		var totalNumRows = numOfRows + parseInt(tableRowCount);

		if(document.getElementById("addingCard").style.display == 'none'){
			document.getElementById("addingCard").style.display = "block";
		}
		
		for(var i= parseInt(tablebody.rows.length)-1; i<totalNumRows-1;i++){
			row= tablebody.insertRow(i);
			var cell = row.insertCell(0);
			var text1 = document.createTextNode(parseInt(i));
			cell.appendChild(text1);
			
			var cell2 = row.insertCell(1);
			var text2 = '<input type="text" value="" id="nickname'+i+'" maxlength="20" name="nickname" class="table_form"/>';
			cell2.innerHTML=text2;
		}
		tableRowCount = numOfRows + 1;
		realTableRowCount = parseInt(tablebody.rows.length);
		var tbody = document.getElementById('bcNickNameTable');
		for(var i= tableRowCount ; i<realTableRowCount-1;i++){
			tbody.deleteRow(tableRowCount); 
		}
	}
	
	var nickNames = '';
	
	//To Get all nicknames entered in purchase card.
	function getAllNickNames(){
			
		if(document.getElementsByName('nickname')){
			var nickNameList = document.getElementsByName('nickname');			
			for(var nameCount = 0; nameCount < nickNameList.length; nameCount++){			
				//validate the nicknames 
				var nickNameVal = nickNameList[nameCount].value;
				if(validateText(nickNameVal,"[^A-Za-z0-9\\s]") && (nickNameVal.length > 0) 
						&&(nickNameVal != 'null')){	
							if(nickNames != ''){
								nickNames = nickNames+','+nickNameVal;
							}else {
								nickNames = nickNameVal;
							}
							nickNameList[nameCount].readonly=true;
				}else{
					alert('Please enter a valid nickname in SNo '+(nameCount+1));					
					break;
				}	
			}					
		}
		if(nickNames == ''){		
			if(document.getElementById("cardNickNames")){				
				if(document.getElementById("cardNickNames").value != ''){				
					nickNames = document.getElementById("cardNickNames").value;
				}								
			}			
		}		
		return nickNames;
	}
	
	//To save all data in the form
	function saveData(showDiv, cartDetails,orderNo){	
		
		if(showDiv == 'addMoneyToCartDiv'){	
			//populatecardDetails('');		
			addNicknamesToCombo(showDiv, cartDetails);	
			if(document.getElementById('breezeCardId'))	{	
				document.getElementById('breezeCardId').options[0].selected = true;
			}
			divId = document.getElementById('productDetailsDivID');
				if(divId){
					divId.style.display='none';
				}
			if(document.getElementById('moneyValue'))	{	
				document.getElementById('moneyValue').value = '';	
			}
			
		}
		else if(showDiv == 'confirmationDiv'){
			if(orderNo != '' && orderNo != '0'){
				modifyDisplayTabData(showDiv, cartDetails, 'fromNext');
			}
		}
		else{
		//navigate to next tab		
			modifyDisplayTabData(showDiv, cartDetails, 'fromNext');
		}
	}
		//MY CART
	function updateCart(cardId, userAction,showTab,cash){	
		var cashValue = '';
		if(cash == null) {
			if(document.getElementById('updateCash'+cardId)){
				cashValue = document.getElementById('updateCash'+cardId).value;
			}	
		}else{
			cashValue = cash;
		}
		var url ;
		if(userAction == 'updateCash'){
			if(isNaN(cashValue) || (cashValue*1 <= 0)){
			    alert('Please enter valid cash value');
			    return;
			}
			else{
			//url= "breezeCardAction.do?dispatchTo=updateShoppingCart&cashValue="+cashValue+
			//	  "&cardId="+cardId+"&tabLocation="+showTab+"&userAction=updateCash";
			 url = "breezeCardAction.do?dispatchTo=purchaseCard&&tabLocation=addMoneyToCartDiv";
			}
		  }
		 else if(userAction == 'removeCash'){
		 var confirmSave= confirm('Are you sure you want to remove ?');
  			
				if(confirmSave == true){
			 		cashValue = '';
			 		url= "breezeCardAction.do?dispatchTo=updateShoppingCart"+
					  "&cardId="+cardId+"&tabLocation="+showTab+"&userAction=removeCash&cashValue="+cashValue;
				  }else{
					  return;
				  }
		  
		 }
		  else if(userAction == 'removeProduct'){	
		   var confirmSave= confirm('Are you sure you want to remove ?');
  			
				if(confirmSave == true){	
		 			url= "breezeCardAction.do?dispatchTo=updateShoppingCart"+
				  "&cardIdProductId="+cardId+"&tabLocation="+showTab+"&userAction=removeProduct";
				   }else{
					  return;
				  }
		  
		 }
		 
		document.forms[0].action = url;
		document.forms[0].method = "POST";
		document.forms[0].submit();
	}
	
	//Edit address from the shipping page in purchase cards
	//The method redirects to the manage address action to edit
	//the selected card
	function editAdd(){	
		if(document.getElementById('addressId')){
			var addressId = document.getElementById('addressId').value;
			var editPayCardVar = document.forms[0].editPaymentCard.value;
			var url = '';
			if(addressId != '' && addressId != '-1'){
				url = 'addressMangementAction.do?dispatchTo=getAddressDetails&addressId='+addressId+'&returnValue=purchasecard&editPayCard='+editPayCardVar;
				document.forms[0].action = url;
				document.forms[0].method = "POST";
				document.forms[0].submit();		
			}
			else{
				document.getElementById("invalidaddAddressTypeId").innerHTML ='Please choose an address';
			}
				
		}
	}
	
	//Show/hide ship to new address div
	function showShipToNewAddress(){
		document.forms[0].editAddress.value = "";
		addressNickNameCheck = "";	
		if(document.getElementById('shipToNewAddress') && document.getElementById('shipToNewAddressTR')){
			var shipToNewAddressChk = document.getElementById('shipToNewAddress');	
			var shipToNewAddressTR = document.getElementById('shipToNewAddressTR');			
			if(shipToNewAddressChk.checked == true){				
					clearAddressFields();
					shipToNewAddressTR.style.display = '';	
					if(document.getElementById('addressId')){
						if(document.forms[0].addressId.length != 1)
						    document.getElementById('addressId').value = document.getElementById('addressId').options[0].value;
						document.getElementById('addressId').disabled = true;
						
					}
			}
			else{
				shipToNewAddressTR.style.display = 'none';
				if(document.getElementById('addressId')){	
					document.getElementById('addressId').disabled = false;
				}
			}
		}
	}	
	
	//To clear all address fields
	function clearAddressFields(){
		if(document.getElementById('shipToNewAddressTR').style.display != 'none'){
			document.getElementById('shipToNewAddressTR').style.display = 'none';
			document.forms[0].editAddress.value="";
		}
		if(document.getElementById('shippingErrorMsg') != null){
			document.getElementById('shippingErrorMsg').innerHTML='';
		}
		document.forms[0].addressNickName.value = "";
		document.forms[0].addresseName.value = "";
		document.forms[0].address1.value = "";
		document.forms[0].address2.value = ""	;	
		document.forms[0].city.value = "";
		document.forms[0].zip.value = "";
		document.forms[0].state.value  = "13";
		document.getElementById('isActive').value  = "1";
		document.getElementById('saveAddress').checked = false;
	}
	
	//To clear all payment fields
	function clearPaymentFields(){
		document.forms[0].addCardNumber.value = "";
		document.forms[0].addNameOnCard.value = "";		
		document.forms[0].addNickName.value = "";
		document.forms[0].addExpirationMonth.value = "-1";
		document.forms[0].addExpirationYear.value = "-1";
		document.forms[0].addCreditCardType.value = "-1";
		document.forms[0].editPaymentCard.value = "";
		if(document.forms[0].billingAddressId.length != 1)
		    document.forms[0].billingAddressId.value  = document.forms[0].billingAddressId.options[0].value;
		document.forms[0].billingAddressNickName.value  = "";
		//document.forms[0].billingAddresseName.value = "";
		document.forms[0].billingAddress1.value = "";
		document.forms[0].billingAddress2.value = "";
		document.forms[0].billingCity.value = "";
		document.forms[0].billingState.value  = "13";
		document.forms[0].billingZip.value  = "";	 
		document.getElementById('saveCardDetails').checked = false;
		document.getElementById('newBillingAddressChk').checked = false;
		document.getElementById('saveBillingAddress').checked = false;	
		document.getElementById("isActive").value  = "1";	
		document.getElementById('billingAddressId').disabled = false;
		document.getElementById('newBillingAddressTR').style.display = 'none';
	}
		
	
	//Save new shipping address
	function saveAddressDetails(isShippingAddressExists){
		
		var isValidated = '';		
			isValidated = validate_shippingAddress();
		if(isValidated && document.getElementById("duplicateaddressNickName").innerHTML ==''){			
			url="breezeCardAction.do?dispatchTo=shippingDetails"+
					  "&tabLocation=paymentMethodDiv";
			if(document.getElementById('shipToNewAddress')){
				var shipToNewAddressChk = document.getElementById('shipToNewAddress');
							
				if(shipToNewAddressChk.checked == true || shipToNewAddressChk.checked == 'checked'){	
					if(document.forms[0].editAddress.value == 'true')
					{
						document.forms[0].addressId.disabled = false;
						var saveAddressChk = document.getElementById('saveAddress');	
						if(saveAddressChk.checked == true){
								url += '&shipTo=oldAddress&isActive=1';	
						}
						else{
								url += '&shipTo=oldAddress&isActive=0';	
						}
					}else{
						var saveAddressChk = document.getElementById('saveAddress');	
						if(saveAddressChk.checked == true){
								url += '&shipTo=newAddress&isActive=1';	
						}
						else{
							document.forms[0].editAddress.value="new";
								url += '&shipTo=newAddress&isActive=0';	
						}
					}
				}
				else{
						
						var saveAddressChk = document.getElementById('saveAddress');	
						if(saveAddressChk.checked == true){
								url += '&shipTo=oldAddress&isActive=1';	
						}
						else{
								url += '&shipTo=oldAddress&isActive=0';	
						}								
				}
			}
			
			document.forms[0].action = url;
			document.forms[0].method = "POST";
			document.forms[0].submit();
		}
	}

	//To show/hide new payment details
	function showPayFromNewCard(){	
		cardNickNameCheck ="";
		if(document.getElementById('payFromNewCard') && document.getElementById('showNewPaymentTR')){
			var newPayementChk = document.getElementById('payFromNewCard');	
			var newPayementTR = document.getElementById('showNewPaymentTR');			
			if(newPayementChk.checked == true ){				
					newPayementTR.style.display = '';
					document.forms[0].addPaymentMode[0].checked = true;
					document.getElementById("cardMsgDiv").style.display = "none";
					if(document.getElementById('paymentCardId')){
						if(document.getElementById('paymentCardId').length != 1)
						    document.getElementById('paymentCardId').value = document.getElementById('paymentCardId').options[0].value;
						document.getElementById('paymentCardId').disabled = true;	
					 }									
					clearPaymentFields();				
			}
			else{
				newPayementTR.style.display = 'none';	
				if(document.getElementById('paymentCardId')){
					document.getElementById('paymentCardId').disabled = false;
				}
			}
		}
	}
		
	function showNewBillingAddress(){
		addressNickNameCheck = "";	
		if(document.getElementById('newBillingAddressChk') && document.getElementById('newBillingAddressTR')){
			var newBillingAddressChk = document.getElementById('newBillingAddressChk');	
			var newBillingAddressTR = document.getElementById('newBillingAddressTR');			
			if(newBillingAddressChk.checked == true || 
					newBillingAddressChk.checked == 'checked'){				
					newBillingAddressTR.style.display = '';	
					if(document.forms[0].billingAddressId.length != 1)
					    document.getElementById('billingAddressId').value = document.getElementById('billingAddressId').options[0].value;
					document.getElementById('billingAddressId').disabled = true;
					document.forms[0].billingAddressNickName.value  = "";
					//document.forms[0].billingAddresseName.value = "";
					document.forms[0].billingAddress1.value = "";
					document.forms[0].billingAddress2.value = "";
					document.forms[0].billingCity.value = "";
					document.forms[0].billingState.value  = "13";
					document.forms[0].billingZip.value  = "";	 
					document.forms[0].editBillingAddress.value  = "new";	 
					document.getElementById('saveBillingAddress').checked = false;	
			}
			else{
				newBillingAddressTR.style.display = 'none';	
				document.getElementById('billingAddressId').disabled = false;
			}
		}
	}
	function getPaymentCardTypes(paymentModeParam){
		document.getElementById("invalidaddCreditCardType").innerHTML ='';
		document.getElementById("invalidaddDebitCardType").innerHTML ='';
		if(paymentModeParam.value == 1){
			document.forms[0].addDebitCardType.selectedIndex = 0
			document.getElementById("addCreditCardTypeList").style.display = "block";
			document.getElementById("addDebitCardTypeList").style.display = "none";
			document.getElementById("cardMsgDiv").style.display = "none";
		}else {
			document.forms[0].addCreditCardType.selectedIndex = 0;
			document.getElementById("addDebitCardTypeList").style.display = "block";
			document.getElementById("addCreditCardTypeList").style.display = "none";
			document.getElementById("cardMsgDiv").style.display = "block";
		}
	}
	
	//Save payment details
	function savePaymentDetails(){	
		if(validatePayment_Address()&&
		document.getElementById("duplicateBillingaddressNickName").innerHTML ==''
		&& document.getElementById("duplicateNickName").innerHTML ==''){
				url="breezeCardAction.do?dispatchTo=reviewOrderDetails"+
						  "&tabLocation=reviewOrderDiv";
				if(document.getElementById('payFromNewCard')){
					var shipToNewAddressChk = document.getElementById('payFromNewCard');					
					if(shipToNewAddressChk.checked == true || shipToNewAddressChk.checked == 'checked'){
						
							var saveCardChk = document.getElementById('saveCardDetails');	
							if(document.getElementById('saveCardDetails') && saveCardChk.checked == true){
							//if(document.forms[0].addNickName.value != ""){
									url += '&isExistingCard=no&isActive=1';	
							}
							else{
									url += '&isExistingCard=no&isActive=0';	
							}
					}
					else{	
							
							//if(document.forms[0].addNickName.value != ""){
							var saveCardChk = document.getElementById('saveCardDetails');	
							if(document.getElementById('saveCardDetails') && saveCardChk.checked == true){
									url += '&isExistingCard=yes&isActive=1';	
							}
							else{
									url += '&isExistingCard=yes&isActive=0';	
							}									
					}
					//Billing address details for new card
							var newBillingAddressChk = document.getElementById('newBillingAddressChk');	
							if(newBillingAddressChk.checked == true || newBillingAddressChk.checked == 'checked'){	
								document.forms[0].editBillingAddress.value = 'true';
								//if(document.forms[0].billingAddressNickName.value != ""){
								var saveCardChk = document.getElementById('saveBillingAddress');	
								if(document.getElementById('saveBillingAddress') && saveCardChk.checked == true){
										url += '&isExistingBillingAddress=no&isBillingAddressActive=1';	
								}
								else{
										url += '&isExistingBillingAddress=no&isBillingAddressActive=0';	
								}
							}
							else{
								document.forms[0].editBillingAddress.value = '';
								url += '&isExistingBillingAddress=yes';	
							}
				}			
				document.forms[0].action = url;
				document.forms[0].method = "POST";
				document.forms[0].submit();
		}
	}


	
	
	
	function saveAllCartDetails(){
		if(document.forms[0].singleSubmit.value == 'true'){
			document.forms[0].singleSubmit.value = 'false';
			url="breezeCardAction.do?dispatchTo=paymentDetails"+
					  "&tabLocation=confirmationDiv";
			document.forms[0].action = url;
			document.forms[0].method = "POST";
			document.forms[0].submit();
		}
	}
	
	function validatePayment_Address(){
		var returnVal = true;
		var jsCurrDate = new Date();
		var jsCurrYear = jsCurrDate.getFullYear();
		var jsCurrMonth = jsCurrDate.getMonth()+1;
			if(document.forms[0].payFromNewCard.checked != true){
			    if(document.forms[0].paymentCardId.value == "-1"){
					document.getElementById("invalidpaymentCardId").innerHTML ='Payment card is required';
					returnVal = false;
				}
				else{
					document.getElementById("invalidpaymentCardId").innerHTML ='';
				}
				
				/*** MBK (start) ***/

				if(document.getElementById('showNewPaymentTR').style.display != 'none'){
			if(document.forms[0].addPaymentMode[0].checked != true 
			  && document.forms[0].addPaymentMode[1].checked != true){
				document.getElementById("invalidaddPaymentMode").innerHTML ='Payment mode is required';
					returnVal = false;
			}
			else{
				document.getElementById("invalidaddPaymentMode").innerHTML ='';
			}
			if(document.forms[0].addPaymentMode[0].checked == true){
			    if(document.forms[0].addCreditCardType.value == "-1"){
					document.getElementById("invalidaddCreditCardType").innerHTML ='Credit card type needs to be selected';
					returnVal = false;
				}
				else{
					document.getElementById("invalidaddCreditCardType").innerHTML ='';
				}
			}
			if(document.forms[0].addPaymentMode[1].checked == true) {
			    if(document.forms[0].addDebitCardType.value == "-1"){
					document.getElementById("invalidaddDebitCardType").innerHTML ='Debit card type needs to be selected';
					returnVal = false;
				}
				else{
					document.getElementById("invalidaddDebitCardType").innerHTML ='';
				}
			}
					
					if(document.getElementById('saveCardDetails').checked == true){
					        if(document.forms[0].addNickName.value == ""){
								document.getElementById("invalidaddNickName").innerHTML ='Nick name is required';
								returnVal = false;
							}
							else{
								if(validateText(document.forms[0].addNickName.value,"[^A-Za-z0-9\\s\\-\\']")){
									document.getElementById("invalidaddNickName").innerHTML ='';
								}else{
									document.getElementById("invalidaddNickName").innerHTML ='Nick name can be alpha numeric with space';
									returnVal = false;
								}
							}
					}
					else{
					document.getElementById("invalidaddNickName").innerHTML ='';
						}
					/*if(document.forms[0].addNickName.value != ""){
						if(validateText(document.forms[0].addNickName.value,"[^A-Za-z0-9\\s\\-\\']")){
							document.getElementById("invalidaddNickName").innerHTML ='';
						}else{
							document.getElementById("invalidaddNickName").innerHTML ='Reference Name is invalid';
							returnVal = false;
						}
					}*/
					if(document.forms[0].addCardNumber.value == ""){
					    document.getElementById("invalidaddCardNumber").innerHTML ='';
						document.getElementById("invalidaddCardNumber").innerHTML ='Card number is required';
							returnVal = false;
					}else{
						document.getElementById("invalidaddCardNumber").innerHTML ='';
						if(oldCreditCardNumber != document.forms[0].addCardNumber.value){
			    			if(!Mod10('addCardNumber'))
			    				returnVal = false;
			    			}	
			    	}
					if(document.forms[0].addNameOnCard.value == ""){
						document.getElementById("invalidaddNameOnCard").innerHTML ='Name on card is required';
							returnVal = false;
					}else{
						if(validateText(document.forms[0].addNameOnCard.value,"[^A-Za-z\\s\\-\\']")){
							document.getElementById("invalidaddNameOnCard").innerHTML ='';
						}else{
							document.getElementById("invalidaddNameOnCard").innerHTML ='Name on card is invalid';
							returnVal = false;
						}
						
					}
					if(document.forms[0].addExpirationMonth.value == "-1" &&
					document.forms[0].addExpirationYear.value == "-1"){
					document.getElementById("invalidaddExpirationMonth").innerHTML ='';
					document.getElementById("invalidaddExpirationYear").innerHTML ='';
						document.getElementById("invalidaddExpirationMonth").innerHTML ='Month/Year Needs to be selected';
						returnVal = false;
					}
					else{
						if(document.forms[0].addExpirationMonth.value == "-1"){
							document.getElementById("invalidaddExpirationMonth").innerHTML ='Month needs to be selected';
							returnVal = false;
						}else{
							document.getElementById("invalidaddExpirationMonth").innerHTML ='';
						}
						if(document.forms[0].addExpirationYear.value == "-1"){
							document.getElementById("invalidaddExpirationYear").innerHTML ='Year needs to be selected';
							returnVal = false;
						}else{
							document.getElementById("invalidaddExpirationYear").innerHTML ='';
						}
						if(jsCurrYear == document.forms[0].addExpirationYear.value){
							if(document.forms[0].addExpirationMonth.value*1 < jsCurrMonth){
								document.getElementById("invalidaddExpirationMonth").innerHTML ='Exp. month should not be less than the current month';
								returnVal = false;
							}
						}
					}
				if(document.getElementById('newBillingAddressChk').checked != true){
					if(document.forms[0].billingAddressId.value == "-1"){
						document.getElementById("invalidBillingAddressTypeId").innerHTML ='Address needs to be selected';
						returnVal = false;
					}else{
						document.getElementById("invalidBillingAddressTypeId").innerHTML ='';
					}
				}
				else{
					if(document.getElementById("invalidBillingAddressTypeId") != null)
					    document.getElementById("invalidBillingAddressTypeId").innerHTML ='';

					//only if nickname is saved
					if(document.forms[0].saveBillingAddress.checked == true){
						if(document.forms[0].billingAddressNickName.value == ""){
							document.getElementById("invalidBillingaddressNickName").innerHTML ='Nick name is required';
							returnVal = false;
						}else{
							if(validateText(document.forms[0].billingAddressNickName.value,"[^A-Za-z0-9\\s\\-\\']")){
								document.getElementById("invalidBillingaddressNickName").innerHTML ='';
							}else{
								document.getElementById("invalidBillingaddressNickName").innerHTML ='Nick names can be alpha numeric with space';
								returnVal = false;
							}
						}
					}else{
						document.getElementById("invalidBillingaddressNickName").innerHTML ='';
					}
					/*if(document.forms[0].billingAddressNickName.value != ""){
						if(validateText(document.forms[0].billingAddressNickName.value,"[^A-Za-z0-9\\s]")){
							document.getElementById("invalidBillingaddressNickName").innerHTML ='';
						}else{
							document.getElementById("invalidBillingaddressNickName").innerHTML ='Reference Name is invalid';
							returnVal = false;
						}
					}	*/				
					//if(document.forms[0].billingAddresseName.value != ""){
						
					
						//if(validateText(document.forms[0].billingAddresseName.value,"[^A-Za-z\\s\\']")){
						//	document.getElementById("invalidBillingaddresseName").innerHTML ='';
						//}
						//else{
						//	document.getElementById("invalidBillingaddresseName").innerHTML ='Only alphabets with space are allowed';
						//returnVal = false;
					//	}
					//}
					if(document.forms[0].billingAddress1.value == ""){
						document.getElementById("invalidBillingaddress1").innerHTML ='Address1 is required';
						returnVal = false;
					}else{
						if(validateText(document.forms[0].billingAddress1.value,"[^a-zA-Z0-9\\s\\'\\,\\.\\-\\#\\/]")){
							document.getElementById("invalidBillingaddress1").innerHTML ='';
						}else{
							document.getElementById("invalidBillingaddress1").innerHTML ='Please enter a valid address';
							returnVal = false;
						}
					}
					if(document.forms[0].billingAddress2.value != ""){
						if(validateText(document.forms[0].billingAddress2.value,"[^a-zA-Z0-9\\s\\'\\,\\.\\-\\#\\/]")){
							document.getElementById("invalidBillingaddress2").innerHTML ='';
						}else{
							document.getElementById("invalidBillingaddress2").innerHTML ='Please enter a valid address';
							returnVal = false;
						}
					}
					if(document.forms[0].billingCity.value == ""){
						document.getElementById("invalidBillingcity").innerHTML ='city is required';
						returnVal = false;
					}else{
						if(validateText(document.forms[0].billingCity.value,"[^A-Za-z\\s]")){
							document.getElementById("invalidBillingcity").innerHTML ='';
						}else{
							document.getElementById("invalidBillingcity").innerHTML ='City is invalid';
							returnVal = false;
						}
						
					}
					if(document.forms[0].billingState.value == ""){
						document.getElementById("invalidBillingstate").innerHTML ='State needs to be selected';
						returnVal = false;
					}else{
						document.getElementById("invalidBillingstate").innerHTML ='';
					}
					if(document.forms[0].billingZip.value == ""){					  
						document.getElementById("invalidBillingzip").innerHTML ='Zip code is required';
						returnVal = false;
					}else{
						var msgValid = validateZIP(document.forms[0].billingZip.value);						
					    if(msgValid == true){					   
					    	document.getElementById("invalidBillingzip").innerHTML ='';
					    }
					    else{
					 	   document.getElementById("invalidBillingzip").innerHTML = msgValid;
					    	returnVal = false;
					    }
					}
				}
			}
								
				/*** MBK (end) ***/
				
				
			}
			else{
				if(document.getElementById("invalidpaymentCardId") != null)
				    document.getElementById("invalidpaymentCardId").innerHTML ='';				

			if(document.forms[0].addPaymentMode[0].checked != true 
			  && document.forms[0].addPaymentMode[1].checked != true){
				document.getElementById("invalidaddPaymentMode").innerHTML ='Payment mode is required';
					returnVal = false;
			}
			else{
				document.getElementById("invalidaddPaymentMode").innerHTML ='';
			}
			if(document.forms[0].addPaymentMode[0].checked == true){
			    if(document.forms[0].addCreditCardType.value == "-1"){
					document.getElementById("invalidaddCreditCardType").innerHTML ='Credit card type needs to be selected';
					returnVal = false;
				}
				else{
					document.getElementById("invalidaddCreditCardType").innerHTML ='';
				}
			}
			if(document.forms[0].addPaymentMode[1].checked == true) {
			    if(document.forms[0].addDebitCardType.value == "-1"){
					document.getElementById("invalidaddDebitCardType").innerHTML ='Debit card type needs to be selected';
					returnVal = false;
				}
				else{
					document.getElementById("invalidaddDebitCardType").innerHTML ='';
				}
			}


				
				if(document.getElementById('saveCardDetails').checked == true){
				        if(document.forms[0].addNickName.value == ""){
							document.getElementById("invalidaddNickName").innerHTML ='Nick name is required';
							returnVal = false;
						}
						else{
							if(validateText(document.forms[0].addNickName.value,"[^A-Za-z0-9\\s\\-\\']")){
								document.getElementById("invalidaddNickName").innerHTML ='';
							}else{
								document.getElementById("invalidaddNickName").innerHTML ='Nick name can be alpha numeric with space';
								returnVal = false;
							}
						}
				}
				else{
					document.getElementById("invalidaddNickName").innerHTML ='';
				}
				/*if(document.forms[0].addNickName.value != ""){
					if(validateText(document.forms[0].addNickName.value,"[^A-Za-z0-9\\s\\-\\']")){
						document.getElementById("invalidaddNickName").innerHTML ='';
					}else{
						document.getElementById("invalidaddNickName").innerHTML ='Reference name is invalid';
						returnVal = false;
					}
				}*/		
				if(document.forms[0].addCardNumber.value == ""){
				    document.getElementById("invalidaddCardNumber").innerHTML ='';
					document.getElementById("invalidaddCardNumber").innerHTML ='Card number is required';
						returnVal = false;
				}else{
					document.getElementById("invalidaddCardNumber").innerHTML ='';
					//if(oldCreditCardNumber != document.forms[0].addCardNumber.value){
			    		if(!Mod10('addCardNumber'))
			    		returnVal = false;
			    	//}				
			    }
				if(document.forms[0].addNameOnCard.value == ""){
					document.getElementById("invalidaddNameOnCard").innerHTML ='Name on card is required';
						returnVal = false;
				}else{
					if(validateText(document.forms[0].addNameOnCard.value,"[^A-Za-z\\s\\-\\']")){
						document.getElementById("invalidaddNameOnCard").innerHTML ='';
					}else{
						document.getElementById("invalidaddNameOnCard").innerHTML ='name on card is invalid';
						returnVal = false;
					}
					
				}
					if(document.forms[0].addExpirationMonth.value == "-1" &&
					document.forms[0].addExpirationYear.value == "-1"){
					document.getElementById("invalidaddExpirationMonth").innerHTML ='';
					document.getElementById("invalidaddExpirationYear").innerHTML ='';
						document.getElementById("invalidaddExpirationMonth").innerHTML ='Month/Year Needs to be selected';
						returnVal = false;
					}
					else{
						if(document.forms[0].addExpirationMonth.value == "-1"){
							document.getElementById("invalidaddExpirationMonth").innerHTML ='Month needs to be selected';
							returnVal = false;
						}else{
							document.getElementById("invalidaddExpirationMonth").innerHTML ='';
						}
						if(document.forms[0].addExpirationYear.value == "-1"){
							document.getElementById("invalidaddExpirationYear").innerHTML ='Year needs to be selected';
							returnVal = false;
						}else{
							document.getElementById("invalidaddExpirationYear").innerHTML ='';
						}
						if(jsCurrYear == document.forms[0].addExpirationYear.value){
							if(document.forms[0].addExpirationMonth.value*1 < jsCurrMonth){
								document.getElementById("invalidaddExpirationMonth").innerHTML ='Exp. month should not be less than the current month';
								returnVal = false;
							}
						}
					}
				if(document.getElementById('newBillingAddressChk').checked != true){
					if(document.forms[0].billingAddressId.value == "-1"){
						document.getElementById("invalidBillingAddressTypeId").innerHTML ='Address needs to be selected';
						returnVal = false;
					}else{
						document.getElementById("invalidBillingAddressTypeId").innerHTML ='';
					}
				}
				else{
					if(document.getElementById("invalidBillingAddressTypeId") != null)
					    document.getElementById("invalidBillingAddressTypeId").innerHTML ='';

					//only if nickname is saved
					if(document.forms[0].saveBillingAddress.checked == true){
						if(document.forms[0].billingAddressNickName.value == ""){
							document.getElementById("invalidBillingaddressNickName").innerHTML ='Nick name is required';
							returnVal = false;
						}else{
							if(validateText(document.forms[0].billingAddressNickName.value,"[^A-Za-z0-9\\s\\-\\']")){
								document.getElementById("invalidBillingaddressNickName").innerHTML ='';
							}else{
								document.getElementById("invalidBillingaddressNickName").innerHTML ='Nick names can be alpha numeric with space';
								returnVal = false;
							}
						}
					}else{
						document.getElementById("invalidBillingaddressNickName").innerHTML ='';
					}
					/*if(document.forms[0].billingAddressNickName.value != ""){
						if(validateText(document.forms[0].billingAddressNickName.value,"[^A-Za-z0-9\\s\\-\\']")){
							document.getElementById("invalidBillingaddressNickName").innerHTML ='';
						}else{
							document.getElementById("invalidBillingaddressNickName").innerHTML ='Reference name is invalid';
							returnVal = false;
						}
					}	*/				
					//if(document.forms[0].billingAddresseName.value != ""){
					//	if(validateText(document.forms[0].billingAddresseName.value,"[^A-Za-z\\s\\']")){
					//		document.getElementById("invalidBillingaddresseName").innerHTML ='';
					//	}
					//	else{
					//		document.getElementById("invalidBillingaddresseName").innerHTML ='Only alphabets with space are allowed';
					//	returnVal = false;
					//	}
					//}
					if(document.forms[0].billingAddress1.value == ""){
						document.getElementById("invalidBillingaddress1").innerHTML ='Address1 is required';
						returnVal = false;
					}else{
						if(validateText(document.forms[0].billingAddress1.value,"[^a-zA-Z0-9\\s\\'\\,\\.\\-\\#\\/]")){
							document.getElementById("invalidBillingaddress1").innerHTML ='';
						}else{
							document.getElementById("invalidBillingaddress1").innerHTML ='Address1 is invalid';
							returnVal = false;
						}
					}
					if(document.forms[0].billingAddress2.value != ""){
						if(validateText(document.forms[0].billingAddress2.value,"[^a-zA-Z0-9\\s\\'\\,\\.\\-\\#\\/]")){
							document.getElementById("invalidBillingaddress2").innerHTML ='';
						}else{
							document.getElementById("invalidBillingaddress2").innerHTML ='Address2 is invalid';
							returnVal = false;
						}
					}
					if(document.forms[0].billingCity.value == ""){
						document.getElementById("invalidBillingcity").innerHTML ='city is required';
						returnVal = false;
					}else{
						if(validateText(document.forms[0].billingCity.value,"[^A-Za-z\\s]")){
							document.getElementById("invalidBillingcity").innerHTML ='';
						}else{
							document.getElementById("invalidBillingcity").innerHTML ='City is invalid';
							returnVal = false;
						}
						
					}
					if(document.forms[0].billingState.value == ""){
						document.getElementById("invalidBillingstate").innerHTML ='State needs to be selected';
						returnVal = false;
					}else{
						document.getElementById("invalidBillingstate").innerHTML ='';
					}
					if(document.forms[0].billingZip.value == ""){					  
						document.getElementById("invalidBillingzip").innerHTML ='Zip code is required';
						returnVal = false;
					}else{
						var msgValid = validateZIP(document.forms[0].billingZip.value);						
					    if(msgValid == true){					   
					    	document.getElementById("invalidBillingzip").innerHTML ='';
					    }
					    else{
					 	   document.getElementById("invalidBillingzip").innerHTML = msgValid;
					    	returnVal = false;
					    }
					}
				}
			}
			return returnVal;
	}
	
	//validate shipping address
	function validate_shippingAddress(){
		var returnVal = true;
				/*if(document.forms[0].addressId!= null && document.forms[0].addressId.value != -1 && document.forms[0].editAddress.value != "true"){
					document.getElementById("invalidaddAddressTypeId").innerHTML ='';
					if(document.getElementById('addressId')){
						if(document.forms[0].addressId.value == "-1"){
							document.getElementById("invalidaddAddressTypeId").innerHTML ='Address needs to be selected';
							returnVal = false;
						}else{
							document.getElementById("invalidaddAddressTypeId").innerHTML ='';
						}
					}else{									
						if(document.getElementById("shipToNewAddress").checked != true){
							document.getElementById("invalidaddAddressTypeId").innerHTML ='Please enter a new address';
							returnVal = false;
						}
					}
				}
				else*/
				if(document.forms[0].shipToNewAddress.checked || document.forms[0].editAddress.value == "true" ){
						if(document.getElementById("invalidaddAddressTypeId"))	{			
							document.getElementById("invalidaddAddressTypeId").innerHTML ='';						
						}
						//only if nickname is saved
						if(document.forms[0].saveAddress.checked == true){
							if(document.forms[0].addressNickName.value == ""){
								document.getElementById("invalidaddressNickName").innerHTML ='Nick name is required';
								returnVal = false;
							}else{
								if(validateText(document.forms[0].addressNickName.value,"[^A-Za-z0-9\\s\\-\\']")){
									document.getElementById("invalidaddressNickName").innerHTML ='';
								}else{
									document.getElementById("invalidaddressNickName").innerHTML ='Nick names can be alpha numeric with space';
									returnVal = false;
								}
							}
						}
						else{
							document.getElementById("invalidaddressNickName").innerHTML ='';
						}
						/*
						if(document.forms[0].addressNickName.value != ""){		
							if(validateText(document.forms[0].addressNickName.value,"[^A-Za-z0-9\\s\\-\\']")){
								document.getElementById("invalidaddressNickName").innerHTML ='';
							}else{
								document.getElementById("invalidaddressNickName").innerHTML ='Reference Name is invalid';
								returnVal = false;
							}
						}
						* */
						if(document.forms[0].addresseName.value == ""){
							document.getElementById("invalidaddresseName").innerHTML ='Full Name is required';
							returnVal = false;
						}else{
							if(validateText(document.forms[0].addresseName.value,"[^A-Za-z\\s\\-\\']")){
								document.getElementById("invalidaddresseName").innerHTML ='';
							}
							else{
								document.getElementById("invalidaddresseName").innerHTML ='Name is invalid';
							returnVal = false;
							}
						}
						if(document.forms[0].address1.value == ""){
							document.getElementById("invalidaddress1").innerHTML ='Address1 is required';
							returnVal = false;
						}else{
							if(validateText(document.forms[0].address1.value,"[^a-zA-Z0-9\\s\\'\\,\\.\\-\\#\\/]")){
								document.getElementById("invalidaddress1").innerHTML ='';
							}else{
								document.getElementById("invalidaddress1").innerHTML ='Address1 is invalid';
								returnVal = false;
							}
						}
						if(document.forms[0].address2.value != ""){
							if(validateText(document.forms[0].address2.value,"[^a-zA-Z0-9\\s\\'\\,\\.\\-\\#\\/]")){
								document.getElementById("invalidaddress2").innerHTML ='';
							}else{
								document.getElementById("invalidaddress2").innerHTML ='Address2 is invalid';
								returnVal = false;
							}
						}
						if(document.forms[0].city.value == ""){
							document.getElementById("invalidcity").innerHTML ='City is required';
							returnVal = false;
						}else{
							if(validateText(document.forms[0].city.value,"[^A-Za-z\\s]")){
								document.getElementById("invalidcity").innerHTML ='';
							}else{
								document.getElementById("invalidcity").innerHTML ='City is invalid';
								returnVal = false;
							}
							
						}
						if(document.forms[0].state.value == ""){
							document.getElementById("invalidstate").innerHTML ='State needs to be selected';
							returnVal = false;
						}else{
							document.getElementById("invalidstate").innerHTML ='';
						}
						if(document.forms[0].zip.value == ""){					  
							document.getElementById("invalidzip").innerHTML ='Zip code is required';
							returnVal = false;
						}else{					
						    var msgValid = validateZIP(document.forms[0].zip.value);
						    if(msgValid == true){
						    	document.getElementById("invalidzip").innerHTML ='';
						    }
						    else{
						 	   document.getElementById("invalidzip").innerHTML = msgValid;
						    	returnVal = false;
						    }
						}
					}
					else{
						if(document.forms[0].addressId.value == -1){
							document.getElementById("invalidaddAddressTypeId").innerHTML ='Address needs to be selected';
							returnVal = false;
						}
					}
				return returnVal;
		
	}

	function validateZIP(zipField) {
		var valid = "0123456789-";
		var hyphencount = 0;

		if (zipField.length!=5 && zipField.length!=10) {		  
			return 'Zip is invalid.';
		}
		for (var i=0; i < zipField.length; i++) {
			temp = "" + zipField.substring(i, i+1);
			if (temp == "-") hyphencount++;
			if (valid.indexOf(temp) == "-1") {			
				return "Invalid characters in your zip code.  Please try again.";
			}
			if ((hyphencount > 1) || ((zipField.length==10) && ""+zipField.charAt(5)!="-")) {
				
				return "The hyphen character should be used with a properly formatted 5 digit+four zip code, like '12345-6789'.Please try again.";
			}
		}
		return true;
	}
	

	//To cancel purchase card/reload card
	function cancelFn(){
		url = "breezeCardAction.do?dispatchTo=cancelAction";
		document.forms[0].action = url;
		document.forms[0].method = "POST";
		document.forms[0].submit();
		return true;	
	}

	function setValue(){
		
		if(document.getElementById('saveCardDetails')){
			if(document.getElementById('saveCardDetails').checked == true){				
				document.getElementById('isActive').value = "1";
			}else{
				document.getElementById('isActive').value = "0";
			}
		}
		if(document.getElementById('saveAddress')){
			if(document.getElementById('saveAddress').checked == true){		
				document.getElementById('isActive').value = "1";
			}else{
				document.getElementById('isActive').value = "0";
			}
		}
	}
		
	/*function setValue(){
		
		if(document.forms[0].addressNickName.value != ""){
			document.getElementById('isActive').value = "1";
		}else{
			document.getElementById('isActive').value = "0";
		}
		if(document.forms[0].addNickName.value != ""){
			document.getElementById('isActive').value = "1";
		}else{
			document.getElementById('isActive').value = "0";
		}
	}*/

	function valPaymentCardForUpdate(paymentCardNo){
		var retVal = false;
		var digits = "0123456789";
		var displayCardNo = "xxxx xxxx";
		if(paymentCardNo.length <= 14 ){
			retVal = true;
			return retVal;
		}
		if(paymentCardNo.indexOf(displayCardNo,0) == -1 ){
			if(paymentCardNo.length <=16){
				for (i=0; i < paymentCardNo.length; i++) {
					singleChar = paymentCardNo.charAt(i);
					if (digits.indexOf(singleChar,0) == -1){
						retVal = true;
					}
				}
			}
			else{
				retVal = true;
			}
		}
		else if(paymentCardNo.length >19){
			retVal = true;
		}	
		return retVal;
	}
	function addCashValue(){
		var moneyVal = document.getElementById('moneyValue').value;
		var cardId ;
		var regid;
		regid = 0;
		if(document.getElementById('breezeCardId')){
			cardId = document.getElementById('breezeCardId').value ;
		}
		if(document.getElementById('regionId')){
		  regid = document.getElementById('regionId').value;
		}
		if(moneyVal == ''){
			alert('Please enter cash value');
			return;
		}
		if(moneyVal != '' && (isNaN(moneyVal) || (moneyVal*1 <= 0 || moneyVal*1 >100))){
			alert('Please enter valid cash value');
			return;
		}
		var url = "breezeCardAction.do?dispatchTo=getProductDetailsForBCard&cardId="+cardId+"&regionid="+regid+"&tabLocation=addMoneyToCartDiv&userAction=addCashToCollection";
		document.forms[0].action = url;
		document.forms[0].method = "POST";
		document.forms[0].submit();									
	}
	
	function isProductAlreadyExist(){
		var  productCount = '0';
		  regid  = '0';
		 //moneyVal = document.getElementById('moneyValue').value;
		 
			AVAILABLE_CASH_VALUE = '';
			if(document.getElementById('breezeCardId')){
				cardId = document.getElementById('breezeCardId').value ;
			}
			//alert(cardId);
			
			if(document.getElementById('regionId')){
			  regid = document.getElementById('regionId').value;
			}
			/*if(moneyVal != '' && (isNaN(moneyVal) || (moneyVal*1 <= 0 && moneyVal*1 >100))){
				 alert('Please enter valid cash value');
				 return;
			}	*/
			//alert('moneyVal'+moneyVal);
			var selectedIds = '';
			if(cardId != '' && cardId != '0'){
			
				if(document.getElementsByName('productChk')){
					var productChks = document.getElementsByName('productChk');					
					for(var productCount=0; productCount<productChks.length; productCount++){
						if(productChks[productCount].checked == true || 
								productChks[productCount].checked == 'checked'){
							if(selectedIds != ''){
								selectedIds += ',';
							}
							selectedIds = selectedIds + productChks[productCount].id;
						}
					}				
				}		
							
				
				//if(selectedIds == '' && document.getElementById('moneyValue').value == ''){
				if(selectedIds == '' ){
					alert('Please select a product before adding the card in cart');
					return;
				}
				else{
					//If selected products count is more than 4 - return
					if(selectedIds != ''){
						var selectedIdsArr = selectedIds.split(',');
						var avaialbleProdIdArr = '';
						var selectedProdID = '';
						if(productNames != '') {
						  avaialbleProdIdArr = productNames;
						}
						//alert('selectedIdsArr'+selectedIdsArr.length);
						if(null != selectedIdsArr && selectedIdsArr != ''){
						   	    
							AVAILABLE_CASH_VALUE = AVAILABLE_CASH_VALUE *1;
							if(AVAILABLE_CASH_VALUE >0){
								if((selectedIdsArr.length+parseInt(productNames.length)) > 5){
									//alert('Selected number of products should not exceed 4.');
									alert('Maximum product allowed in card should not exceed 4.')
									return;
								}
							}else{
									isThisCash = '';
								 	for(var selectedIdNum=0; selectedIdNum<avaialbleProdIdArr.length; selectedIdNum++) {
										selectedProdId = avaialbleProdIdArr[selectedIdNum];
										isThisCash = selectedProdId;
										if(isThisCash == 32769){
										break;
										}
						    	 	}	
						    	if(isThisCash == '32769'){
						    		if((selectedIdsArr.length+parseInt(productNames.length)) > 5){
										//alert('Selected number of products should not exceed 4.');
										alert('Maximum product allowed in card should not exceed 4.')
										return;
									}
						    	}else{ 
									if((selectedIdsArr.length+parseInt(productNames.length)) > 4){
										//alert('Selected number of products should not exceed 4.');
										alert('Maximum product allowed in card should not exceed 4.')
										return;
									}
								}
							}
							for(var selectedIdNum=0; selectedIdNum<selectedIdsArr.length; selectedIdNum++) {
								selectedProddetails = selectedIdsArr[selectedIdNum];
								selectedProdId = selectedProddetails.split("_");
									
								    productIdSelected = selectedProdId[3];
									for(var avaialbleIdNum=0; avaialbleIdNum<avaialbleProdIdArr.length; ++avaialbleIdNum) {
										availableProdId = avaialbleProdIdArr[avaialbleIdNum];
										//alert('productIdSelected'+productIdSelected+'availableProdId'+availableProdId);
										if(parseInt(productIdSelected) == parseInt(availableProdId) ) {
										 alert(selectedProdId[1]+'  already exists in this card, cannot add again.');
										 return;
										}
									}
								
							}	
						}
					}
				
					if(document.getElementById('selectedProducts')){
						document.getElementById('selectedProducts').value = selectedIds;
					}	
					var url = '';
					url = "breezeCardAction.do?dispatchTo=getProductDetailsForBCard&cardId="+cardId+"&regionid="+regid+"&tabLocation=addMoneyToCartDiv&userAction=addToCollection";
					document.forms[0].action = url;
					document.forms[0].method = "POST";
					document.forms[0].submit();									
				}
			}
			else{
				alert('Please select a card');			
				divId = document.getElementById('productDetailsDivID');
				if(divId){
					divId.style.display='none';
				}
			}		
	}
	
	function removeCheckOutCart(prodId){
	
			var confirmDelete	= confirm('Are you sure you want to remove?');  			
			if(confirmDelete){
				if(document.getElementById('breezeCardId')){
					cardId = document.getElementById('breezeCardId').value ;
				}
				removeCarturl = "breezeCardAction.do?dispatchTo=getProductDetailsForBCard&cardId="+cardId+"&productid="+prodId+"&tabLocation=addMoneyToCartDiv&userAction=removeCollection";
				document.forms[0].action = removeCarturl;
				document.forms[0].method = "POST";
				document.forms[0].submit();	
			}else{
				return;
			}
	}
	
	function checkOutCart(tabLocatn,AVAILABLE_CASH_VALUE,avaialableProducts,avaialbleProdIdArr){
	
		if(document.getElementById('breezeCardId')){
				cardId = document.getElementById('breezeCardId').value ;
		}
	
		if(parseInt(avaialableProducts) ==0){	
			alert('Your shoppingcart is empty, you cannot checkout');
			return;
		}else{
			var url = "breezeCardAction.do?dispatchTo=getProductDetailsForBCard&cardId="+cardId+"&tabLocation="+tabLocatn+"&userAction=addToCart";
			document.forms[0].action = url;
			document.forms[0].method = "POST";
			document.forms[0].submit();			
		}		
	}
	function createAjaxRequest() {
		if (window.XMLHttpRequest) { // Mozilla, Safari,...
			request = new XMLHttpRequest();
		} else {
			if (window.ActiveXObject) { // IE
				try {
					request = new ActiveXObject("Msxml2.XMLHTTP");
				}
				catch (e) {
					try {
						request = new ActiveXObject("Microsoft.XMLHTTP");
					}
					catch (e) {
		           //Exception
					}
				}
			}
		}
	}
	
	var showDivTemp= '';
	var cartDetailsTemp = '';
	var isFromNextTemp ='';
	var cart_cardId_addIdTemp = '';
	function checkShippingAddress(showDiv, cartDetails, isFromNext, cart_cardId_addId){
		createAjaxRequest();
		showDivTemp = showDiv;
		cartDetailsTemp = cartDetails;
		isFromNextTemp = isFromNext;
		cart_cardId_addIdTemp = cart_cardId_addId;
		url = "jsp/Helper.jsp?action=checkShippingAddress&addressId=" + cart_cardId_addId ;
			if (navigator.appName == "Microsoft Internet Explorer") {
				request.onreadystatechange = shippingAddressResponseHandler;
				request.open("POST", url, false);
			} else {
				request.onload = shippingAddressResponseHandler;
				request.open("GET", url, false);
			}
			request.send(null);
	}
	
		function Mod10(cardNumber) {  
		
		ccNumb=document.getElementById(cardNumber).value;
		var valid = "0123456789";
		ccNumb =  ccNumb.split(' ').join('');
		var len = ccNumb.length;  
		var iCCN = parseInt(ccNumb);  // integer of ccNumb 
		var sCCN = ccNumb.toString();  // string of ccNumb 
		sCCN = sCCN.replace (/^\s+|\s+$/g,'');  // strip spaces 
		var iTotal = 0;  // integer total set at zero 
		var bNum = true;  // by default assume it is a number 
		var bResult = false;  // by default assume it is NOT a valid cc 
		var temp;  // temp variable for parsing string 
		var calc;  // used for calculation of each digit
		
		// Determine if the ccNumb is in fact all numbers 
		for (var j=0; j<len; j++) {
		  temp = "" + sCCN.substring(j, j+1);
		  if (valid.indexOf(temp) == "-1"){bNum = false;} }

		// if it is NOT a number, you can either alert to the fact, or just pass a failure 
		if(!bNum){
			//alert("Not a Number");
		  bResult = false; }

		// Determine if it is the proper length 
		if((len == 0)&&(bResult)){  // nothing, field is blank AND passed above # check
		  bResult = false;
		} else{  // ccNumb is a number and the proper length - let's see if it is a valid card number
		  if(len >= 15){  // 15 or 16 for Amex or V/MC
		    for(var i=len;i>0;i--){  // LOOP throught the digits of the card
		      calc = parseInt(iCCN) % 10;  // right most digit
		      calc = parseInt(calc);  // assure it is an integer
		      iTotal += calc;  // running total of the card number as we loop - Do Nothing to first digit
		      i--;  // decrement the count - move to the next digit in the card
		      iCCN = iCCN / 10;                               // subtracts right most digit from ccNumb
		      calc = parseInt(iCCN) % 10 ;    // NEXT right most digit
		      calc = calc *2;                                 // multiply the digit by two
		      // Instead of some screwy method of converting 16 to a string and then parsing 1 and 6 and then adding them to make 7,
		      // I use a simple switch statement to change the value of calc2 to 7 if 16 is the multiple.
		      switch(calc){
		        case 10: calc = 1; break;       //5*2=10 & 1+0 = 1
		        case 12: calc = 3; break;       //6*2=12 & 1+2 = 3
		        case 14: calc = 5; break;       //7*2=14 & 1+4 = 5
		        case 16: calc = 7; break;       //8*2=16 & 1+6 = 7
		        case 18: calc = 9; break;       //9*2=18 & 1+8 = 9
		        default: calc = calc;           //4*2= 8 &   8 = 8  -same for all lower numbers
		      }                                               
		    iCCN = iCCN / 10;  // subtracts right most digit from ccNum
		    iTotal += calc;  // running total of the card number as we loop
		  }  // END OF LOOP
		  if ((iTotal%10)==0){  // check to see if the sum Mod 10 is zero
		    bResult = true;  // This IS (or could be) a valid credit card number.
		  } else {
		    bResult = false;  // This could NOT be a valid credit card number
		    }
		  }
		}
		// change alert to on-page display or other indication as needed.
		if(bResult) {
		  return true; 
		  } 
		if(!bResult){
		  //alert("Please enter a valid payment card number."); 
			  if(cardNumber == 'addCardNumber'){
			  	document.getElementById("invalidaddCardNumber").innerHTML = "Invalid payment card number";
			  }else{
			  	document.getElementById("invalideditCardNumber").innerHTML = "Invalid payment card number";
			  }
		  }
		  document.forms[0][cardNumber].focus();
		  document.forms[0][cardNumber].select();
		  return false; // Return the results
		}
		
	function shippingAddressResponseHandler() {
	    // Complete request completed and can receive the reponse
	var textToSplit;
	document.getElementById("msgDiv").innerHTML = "";
	if (request.readyState == 4) {
		    // OK response is ready to use
		if (request.status == 200) {
			if (removeNL(request.responseText) == "order") {
				document.getElementById("msgDiv").innerHTML = "Pending order with this address.Cannot be updated";
				document.getElementById("msgDiv").setAttribute("class", "errormsg");
			}else{
				modifyDisplayTabData(showDivTemp,cartDetailsTemp,isFromNextTemp,cart_cardId_addIdTemp);
			}
		} else {
			alert("HTTP error: " + request.status);
		}
	}
}
	