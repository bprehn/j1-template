// Replace this configuration with your actual Firebase project configuration
// To get this: Go to Firebase Console -> Project Settings -> General -> Your apps
const firebaseConfig = {
    apiKey: "AIzaSyBy2Lza70g_fQb0FLosnkzWoxRY0bT9eFI",
    authDomain: "mk-trail-n-lift-status.firebaseapp.com",
    databaseURL: "https://mk-trail-n-lift-status-default-rtdb.firebaseio.com",
    projectId: "mk-trail-n-lift-status",
    storageBucket: "mk-trail-n-lift-status.appspot.com",
    messagingSenderId: "G-7HVQ9PL099",
    appId: "1:1004261871949:web:6745e2e60e4286e53e6704"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
var auth = firebase.auth();
var database = firebase.database();
