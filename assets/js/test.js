// Useful - https://developers.google.com/web/fundamentals/codelabs/push-notifications

var db = null;
var swRegistration = null;
var isSubscribed = false;
//const applicationServerPublicKey = 'BJEmLHcgkIMhmtM1RvtUtpg01ue_ZJUrWxY42_IlR5KgNMjKHH8DT9bM4xP8w9CJOJpyf2_dVpORdS99vPoFnSQ';
//const applicationServerPublicKey = 'BJEmLHcgkIMhmtM1RvtUtpg01ue_ZJUrWxY42_IlR5KgNMjKHH8DT9bM4xP8w9CJOJpyf2_dVpORdS99vPoFnSQ';
var applicationServerPublicKey = null;

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
function initSubscribe(serverKey){
    
    applicationServerPublicKey = serverKey;
    
    const params = new URLSearchParams(window.location.search);  
    var subId = params.get("p");
    if(subId!=null && subId!=localStorage.getItem('userId')){
        console.log('here')
        /* Check if service workers and push messaging is supported by the browser */
        if ('serviceWorker' in navigator && 'PushManager' in window) {
          console.log('Service Worker and Push is supported');

          navigator.serviceWorker.register('/sw.js', {scope: '/profile.html?p='+subId})
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
    
    $.confirm({
        title: "<h2 style='text-transform: capitalize; letter-spacing: normal; line-spacing: normal;'>Notification Permissions</h2>",
        content: "<h5 style='text-transform: none; letter-spacing: normal; line-spacing: normal;'>To receive <strong style='text-transform: capitalize;'>Pushd</strong> notifications from the content creators on this platform, you must grant push-notification permission to <strong style='text-transform: capitalize;'>Pushd</strong>.</h5>",
        type: 'purple',
        boxWidth: '30%',
        useBootstrap: false,
        typeAnimated: true,
        buttons: {
            grant: {
                text: 'Grant',
                btnClass: 'btn-white',
                action: function(){
                    askPermission()
                }
            },
            deny: {
                text: 'Deny',
                btnClass: 'btn-white',
                action: function(){
                    return;
                }
            }
        },
        draggable: false,
    });
      
    return;
  }
  else if(Notification.permission === 'granted'){      
      if (isSubscribed) {
          $('#subButton').html('Unsubscribe');
      } else {
          $('#subButton').html('Subscribe');
      }

      $('#subButton').prop('disabled', false);
  }
  else {
      console.log(Notification.permission)
      $.confirm({
            title: "<h2 style='text-transform: capitalize; letter-spacing: normal; line-spacing: normal;'>Notification Permissions</h2>",
            content: "<h5 style='text-transform: none; letter-spacing: normal; line-spacing: normal;'>To receive <strong style='text-transform: capitalize;'>Pushd</strong> notifications from the content creators on this platform, you must grant push-notification permission to <strong style='text-transform: capitalize;'>Pushd</strong>.</h5>",
            type: 'purple',
            boxWidth: '30%',
            useBootstrap: false,
            typeAnimated: true,
            buttons: {
                grant: {
                    text: 'Grant',
                    btnClass: 'btn-white',
                    action: function(){
                        askPermission()
                    }
                },
                deny: {
                    text: 'Deny',
                    btnClass: 'btn-white',
                    action: function(){
                        return;
                    }
                }
            },
            draggable: false,
      });
  }
}

function askPermission() {
  return new Promise(function(resolve, reject) {
        const permissionResult = Notification.requestPermission(function(result) {
            console.log(result)
            if(result==='granted'){
                if (isSubscribed) {
                  $('#subButton').html('Unsubscribe');
                } else {
                  $('#subButton').html('Subscribe');
                }

                $('#subButton').prop('disabled', false);
            }
        });
  })
}

function subButtonClick(){
    if(applicationServerPublicKey!=null){
        $('#subButton').prop('disabled', true);

        if (isSubscribed) {
          unsubscribeUser();
        } else {
          subscribeUser();
        }
    }
}

function unsubscribeUser() {
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
      
    const params = new URLSearchParams(window.location.search);  
    var subId = params.get("p");
      
    if (subscription && subId!=null) {
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
              badge: './images/favicon.png',
              vibrate: [200, 100, 200, 100, 200, 100, 200],
              tag: 'vibration-sample'
            });
        });
    }
    else{
        console.log('not granted')
    }
}

  

