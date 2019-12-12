self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
    console.log(event)

    notification = event.data.json()
    const title = notification.title;
    const options = {
        body: notification.message,
        badge: '/images/favicon.png',
        icon: notification.icon,
        //image: 'https://fraserkieran.com/images/gym-push.png',
        data: {
            id: "uniqueId"
        },
        actions: [
            {
              action: 'read-later',
              title: 'read later',
              icon: '/images/demos/action-1-128x128.png'
            },
            {
              action: 'liked',
              title: 'like',
              icon: '/images/demos/action-2-128x128.png'
            },
            {
              action: 'another',
              title: 'another',
              icon: '/images/demos/action-2-128x128.png'
            }
        ]
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
    if (!event.action) {
        // Was a normal notification click
        console.log('Notification Click.');
        return;
    }

    switch (event.action) {
    case 'read-later':
      console.log('deliver notification later');
      console.log(event)
      break;
    case 'liked':
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
    }
});