// Set up Firebase instance

// Request permission from user

// Create 

var db = null;

$.getScript('https://www.gstatic.com/firebasejs/7.4.0/firebase-app.js', function()
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

        db = empushyApp.database();

        navigator.serviceWorker.register('assets/js/sw.js').then( function(result){
            
            displayNotification();
        });

        Notification.requestPermission (status => {
            console.log('Notification permission status: ', status)
            //displayNotification();
        })
    });
});

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

  

