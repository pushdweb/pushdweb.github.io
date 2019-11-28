// Useful - https://developers.google.com/web/fundamentals/codelabs/push-notifications

var db = null;
var swRegistration = null;
var isSubscribed = false;
//const applicationServerPublicKey = 'BJEmLHcgkIMhmtM1RvtUtpg01ue_ZJUrWxY42_IlR5KgNMjKHH8DT9bM4xP8w9CJOJpyf2_dVpORdS99vPoFnSQ';
const applicationServerPublicKey = 'BJEmLHcgkIMhmtM1RvtUtpg01ue_ZJUrWxY42_IlR5KgNMjKHH8DT9bM4xP8w9CJOJpyf2_dVpORdS99vPoFnSQ';

/*$.getScript('https://www.gstatic.com/firebasejs/7.4.0/firebase-app.js', function()
{
    $.getScript('https://www.gstatic.com/firebasejs/7.4.0/firebase-database.js', function()
    {   
        // Your web app's Firebase configuration
        var firebaseConfig = {
            apiKey: "AIzaSyBJpTtm__4p2TRQnBs71PG5u0odryHPxqs",
            authDomain: "autoempushy.firebaseapp.com",
            databaseURL: "https://autoempushy.firebaseio.com",
            projectId: "autoempushy",
            storageBucket: "autoempushy.appspot.com",
            messagingSenderId: "787581605206",
            appId: "1:787581605206:web:5cc765820a98b8008d32f7",
            measurementId: "G-NWVD0JG36T"
        };
        // Initialize Firebase
        var empushyApp = firebase.initializeApp(firebaseConfig, "empushyApp");
        db = empushyApp.database();*/

const params = new URLSearchParams(window.location.search);  
var subId = params.get("p");
if(subId!=null && subId!=localStorage.getItem('userId')){
    $('#editButton').hide()
    /* Check if service workers and push messaging is supported by the browser */
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      console.log('Service Worker and Push is supported');

      navigator.serviceWorker.register('assets/js/sw.js')
      .then(function(swReg) {
        console.log('Service Worker is registered', swReg);

        swRegistration = swReg;
        initializeUI();

      })
      .catch(function(error) {
        console.error('Service Worker Error', error);
      });
    } else {
      console.warn('Push messaging is not supported');
    }
}
else{
    // hide sub
    // show edits
    // show nav
    
    $('#subButton').hide()
}


        
/*
    });
});
*/

/* Set button text depending if user subbed or not */
function initializeUI() {
  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    isSubscribed = !(subscription === null);

    if (isSubscribed) {
      console.log('User IS subscribed.');
    } else {
      console.log('User is NOT subscribed.');
    }

    updateBtn();
  });
}

function updateBtn() {

  if (Notification.permission === 'denied') {
    $('#subButton').prop('disabled', true);
    updateSubscriptionOnServer(null);
    return;
  }
    
  if (isSubscribed) {
      $('#subButton').html('Unsubscribe');
  } else {
      $('#subButton').html('Subscribe');
  }

  $('#subButton').prop('disabled', false);
}

function subButtonClick(){
    console.log('subscription button clicked')
    $('#subButton').prop('disabled', true);
    
    if (isSubscribed) {
      unsubscribeUser();
    } else {
      subscribeUser();
    }
}

function unsubscribeUser() {
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    
      
    if (subscription) {
        // unsub api call using subscription object to search for applicable sub
        
        var subUrl = "http://localhost:5000/v1/unsub";

        var formData = JSON.stringify({
            "userId": null,
            "subId": subId,
            "subInfo": subscription            
        })

        $.ajax ({
            url: subUrl,
            type: "POST",
            data: formData,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            success: function(data) {
                try{
                    
                }
                catch(err){}
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                
            } 
        });
        
        return subscription.unsubscribe();
    }
  })
  .catch(function(error) {
    console.log('Error unsubscribing', error);
  })
  .then(function() {
    //updateSubscriptionOnServer(null);

    console.log('User is unsubscribed.');
    isSubscribed = false;

    updateBtn();
  });
}

function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  .then(function(subscription) {
    console.log('User is subscribed.');

    updateSubscriptionOnServer(subscription);

    isSubscribed = true;

    updateBtn();
  })
  .catch(function(err) {
    console.log('Failed to subscribe the user: ', err);
    updateBtn();
  });
}

function updateSubscriptionOnServer(subscription) {
  // TODO: Send subscription to application server

  if (subscription) {
    const params = new URLSearchParams(window.location.search);  
    var subId = params.get("p");
    var subInfo = subscription

    console.log(subId)
    var subUrl = "http://localhost:5000/v1/sub";

    var formData = JSON.stringify({
        "userId": null,
        "subId": subId,
        "subInfo": subInfo            
    })

    $.ajax ({
        url: subUrl,
        type: "POST",
        data: formData,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        crossDomain: true,
        success: function(data) {
            try{
               
            }
            catch(err){}
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            
        } 
    });
      
  } else {
    console.log('subscription was null')
  }
}

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function writeUserData(userId, name, email) {
    if(db!=null){
        db.ref('users/' + userId).set({
            username: name,
            email: email
        });
    }
    else{
        console.log('Not working')
    }
}

function displayNotification() {
    console.log('display notification')
    if(Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(function(registration) {
            registration.showNotification('Vibration Sample', {
              body: 'Buzz! Buzz!',
              icon: '../images/touch/chrome-touch-icon-192x192.png',
              vibrate: [200, 100, 200, 100, 200, 100, 200],
              tag: 'vibration-sample'
            });
        });
    }
    else{
        console.log('not granted')
    }
}

  

