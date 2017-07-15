var eNotify = require('electron-notify');
// Change config options
eNotify.setConfig({
    appIcon: path.join(__dirname, '7out.png'),
    displayTime: 6000
});
 
// Send simple notification
eNotify.notify({ title: 'Notification title', text: 'Some text' });
// Notification with URL, click notification to open
eNotify.notify({ title: 'Notification title', text: 'Some text', url: 'http://wikipedia.org'});
// Or with image and playing a sound on show
eNotify.notify({
    title: 'Notification title',
    text: 'Some text', url: 'http://wikipedia.org',
    image: path.join(__dirname, '7out.png'),
    sound: path.join(__dirname, 'sound.wav')
});
// Do something when user clicks on notification
eNotify.notify({ title: 'Custom func', onClickFunc: function() {
    // Your code here
    console.log('User clicked notification')
}});
 
// Change config options between notify calls
eNotify.setConfig({
    appIcon: path.join(__dirname, 'images/otherIcon.png'),
    defaultStyleText: {
        color: '#FF0000',
        fontWeight: 'bold'
    }
});
// Send notification that uses the new options
eNotify.notify({ title: 'Notification title', text: 'This text is now bold and has the color red' });
 
// See below for more options