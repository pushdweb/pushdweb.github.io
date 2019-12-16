self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    notification = event.data.json()
    const title = notification.title;
    
    // send request to update delivery metric for this notification..
    notification_data = { notification: { data: { notificationId: notification.id, userId: notification.userId } } }
    update_engagement(notification_data, 'delivered')
    
    var options = {}
    
    if(notification.imageURL!=''){
        console.log(notification.imageURL)
        options = {
            body: notification.message,
            badge: '/images/badge.png',
            icon: notification.icon,
            image: notification.imageURL,
            data: {
                notificationId: notification.id,
                userId: notification.userId
            },
            actions: [
                {
                  action: 'read-later',
                  title: '💾 Later',
                  icon: 'https://pushdweb.github.io/images/ic_later.png'
                },
                {
                  action: 'liked',
                  title: '👍 Like',
                  icon: 'https://pushdweb.github.io/images/ic_like.png'
                }            
            ]
        };
    }
    else {
        options = {
            body: notification.message,
            badge: '/images/badge.png',
            icon: notification.icon,
            data: {
                notificationId: notification.id,
                userId: notification.userId
            },
            actions: [
                {
                  action: 'read-later',
                  title: '💾 Later',
                  icon: 'https://pushdweb.github.io/images/ic_later.png'
                },
                {
                  action: 'liked',
                  title: '👍 Like',
                  icon: 'https://pushdweb.github.io/images/ic_like.png'
                }            
            ]
        };  
    }

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
    
    event.notification.close();
    
    if (!event.action) {
        // Was a normal notification click
        console.log('Notification Click.');
        update_engagement(event, 'clicked')
        if (clients.openWindow) {
            event.waitUntil(clients.openWindow('https://pushdweb.github.io/notification.html?p='+event.notification.data.userId+'&n='+event.notification.data.notificationId));
        }
        return;
    }

    switch (event.action) {
    case 'read-later':
        console.log('deliver notification later');
        update_engagement(event, 'later')
        break;
    case 'liked':
        console.log('Update like metrics for this notification');
        update_engagement(event, 'liked')
        break;
    default:
        console.log(`Unknown action clicked: '${event.action}'`);
        update_engagement(event, 'unknown')
        break;
    }
});

self.addEventListener('notificationclose', function(event) {
    console.log('closed!')
    if (event.notification.data) {
        update_engagement(event, 'dismissed')
    }
});

function update_engagement(event, engagement){

    var engageUrl = "https://autoempushy.herokuapp.com/v1/push-engage";

    var formData = JSON.stringify({
        "userId": event.notification.data.userId,
        "notificationId": event.notification.data.notificationId,
        "engagement": engagement
    })
    
    fetch(engageUrl, {
        method: 'post',
        headers: {
          "Content-type": "application/json; charset=utf-8"
        },
        body: formData
    })
}