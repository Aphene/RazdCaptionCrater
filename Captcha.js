
/// Team Raz Capcha Crater
/// ETHDenver 2023 Scroll Bounty Contender

/// This is the app ui page written in the Razd Javascript Framework


// onStart called on page load.
// initializes data arrays and sets the UI to the start page.

$onStart = () => {
  $capchaImages=[];
  $displayAry=[];
  $toggles=[];
  $goPage("Start","MainPanel");
  $title="";
}


// onClick captures all touch and mouse input.
// each UI element name is used in a switch statement to determine require action

$onClick = (e) => {
    let name = e.element.name;

  switch(name) {
    case "StartPanel":                // move away from splash page
      $goPage("Query","MainPanel");
      break;
    case "SearchButton":              // search google for images bring back 16.
      $searchTerm=$SearchInput.text;
      $search($searchTerm);
      $goPage("Images","MainPanel");
      break;
    case "SearchResultTemplate":   // user is selecting an image to be added to the captcha
      let img= e.data.img;
      $capchaImages.push(img);
      $toggles.push("");
	  $populate();
      break;
    case "CapchaTemplate":       // user changed their mind, removing image from captcha
      let indx = e.actionIndex;
      $capchaImages.splice(indx,1);
      $toggles.splice(indx,1);
	  $populate();
      break;
    case "Toggle":    // set whether image is a 'good' image. if good, capcha solver must click on this image to pass
      $toggles[e.actionIndex]=e.element.text;
      break;
    case "BackToQuery":    // go back and get some more images
      $goPage("Query","MainPanel");
      break;
    case "ToTitle":      // go to page where captcha instructions are entered
      $goPage("Title","MainPanel");
      break;
    case "ToTest":    // go to Test page to see how the captch is working
	  $gotoTest();
      break;
    case "ToDeploy":   // go to page to deploy the captcha
      $goPage("Deploy","MainPanel");
      break;
    case "ToImages":    // used by back buttons to navigate back
      $goPage("Images","MainPanel");
      break;
      case "TestImagePanel":    // used by back buttons to navigate back
      $highlightTestPanel(e.element);
      break;
      case "UpdateTitle": // used by back buttons to navigate back
      $updateTitle();
      break;
      case "TitleInput":  // used by back buttons to navigate back
      $title=$TitleInput.text;
      break;
      case "MakePaymentButton":  // This calls the Metamask wallet to spend some ETH for deployment
      $makePayment();
      break;
      case "SubmitEmail":   // Submit an email for notifications
      $goPage("Start", "MainPanel");
      break;
      case "AlertOkButton":  // Error Panel Ok button
      $goPage("Start", "MainPanel");
      break;
  }
}

/// Update captcha instructions submit button action

$updateTitle = () => {
  $title = $TitleInput.text;
  $gotoTest();
}


/// Navigate to test page

$gotoTest = () => {
   $goPage("Test","MainPanel");
   $TestTitle.text=$title;
   $populateTest();
   $initTestToggles();
   $getTestStatus();
}

// set frame colors for test menu
   $c="#FFFFFF";
   $u = "#666666";

/// Initialize the state of the Image toggle buttons

$initTestToggles = () => {
  $testToggles=[];
  for (var i=0;i<$toggles.length;++i) {
    $testToggles.push("");
  }
  for (var i=0;i<$TestGrid.grid.elements.length;++i) {
     let elm = $TestGrid.grid.elements[i];

     elm.backColor=$u;
     elm.selectedBackColor=$u;
  }
}


// On Test Page Image click, highlight an image frame on touch

$highlightTestPanel = (elm) => {
  let parent=elm.parent;
  if (parent.backColor===$c) {
  	parent.backColor=$u;
    parent.selectedBackColor=$u;
    
  }
  else {
  	parent.backColor=$c;
	parent.selectedBackColor=$c;
  }
  $getTestStatus();
}


// calculate whether the captcha passed the test

$getTestStatus = () => {
  let success=true;
  for (var i=0;i<$toggles.length;++i) {
     let elm = $TestGrid.grid.elements[i]; 
      if (elm.backColor===$u) {
         if ($toggles[i]!=="") {
           success=false;
         }
      }
      else {  // if highlighted
          if ($toggles[i]==="") {
             success=false;
          }
      }
  }
  if (success) {
    $TestStatus.text = "Success!";
  }
  else {
    $TestStatus.text = "Sad Fail";
  }
  
}

// Relay search request to server

$search = (term) => {
  server.imageSearch(term,$searchReply);
}



// handle server image search reply

$searchReply = (reply) => {
  let ary = JSON.parse(reply);
  $SearchResultGrid.grid.populate(ary);
}



// Populate the Image menu with the search reply

$populate = () => {
  $obs=[];
  for (var i=0;i<$capchaImages.length;++i) {
  	let ob={};
	ob.name=$capchaImages[i];
    ob.toggle=$toggles[i];
    $obs.push(ob);
  }
  $CapchaGrid.grid.populate($obs);
  
}



// Populate the Test Image menu with Captcha images

$populateTest = () => {
  $obs=[];
  for (var i=0;i<$capchaImages.length;++i) {
  	let ob={};
	ob.name=$capchaImages[i];
    ob.toggle=$toggles[i];
    $obs.push(ob);
  }
  $TestGrid.grid.populate($obs);
  
}


// Calculate Weis for MetaMask submission

$etherToWei = (ether) => {
	return ether * 10**18;
}


// Call MetaMask and make a payment.

$makePayment = () => {
    const web3 = null;
    try {
        web3 = new Web3(window.ethereum);
        if (!web3) {
            alert("No wallet found");
        }
    }
    catch (e) {
        $goPage("Alert", "MainPanel");
    }

  window.ethereum.enable(function(error) {
    if (error) {
      console.error(error);
      return;
    }

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.error(error);
        return;
      }

      const paymentContract = new web3.eth.Contract(PaymentContractABI, paymentContractAddress);

      paymentContract.methods.makePayment().send({
        from: accounts[0],
        value: paymentAmount
      }, function(error, result) {
        if (error) {
          console.error(error);
          return;
        }
        $transactionHash = result.transactionHash;
        $goPage("Thanks","MainPanel");
      });
    });
  });
}



