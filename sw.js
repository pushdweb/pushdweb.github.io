self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    notification = event.data.json()
    const title = notification.title;
    
    // send request to update delivery metric for this notification..
    // need the id of user pushing.. 
    
    const options = {
        body: notification.message,
        badge: '/images/badge.png',
        icon: notification.icon,
        //image: 'https://fraserkieran.com/images/gym-push.png',
        data: {
            id: "uniqueId"
        },
        actions: [
            {
              action: 'read-later',
              title: '⌛ Later',
              icon: 'https://autoempushy.herokuapp.com/images/later.png'
            },
            {
              action: 'liked',
              title: '👍 Like',
              icon: 'https://autoempushy.herokuapp.com/images/later.png'
            }            
        ]
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
    
    event.notification.close();
    if (!event.action) {
        // Was a normal notification click
        console.log('Notification Click.');
        Message.default.info('Clicked')
        return;
    }

    switch (event.action) {
    case 'read-later':
      Message.default.info('Later')
      console.log('deliver notification later');
      console.log(event)
      break;
    case 'liked':
      Message.default.info('Liked')
      console.log('Update like metrics for this notification');
      break;
    default:
      console.log(`Unknown action clicked: '${event.action}'`);
      break;
    }
});

self.addEventListener('notificationclose', function(event) {
    if (event.notification.data) {
        console.log(event.notification.data.id)
        Message.default.info('closed')
    }
});