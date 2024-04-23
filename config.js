    import firebase from 'firebase/compat/app';
    import 'firebase/compat/auth';
    import 'firebase/storage';
    
     
    //deploy
    const firebaseConfig = {
    apiKey: "AIzaSyBcKZ-rNW4E0qDU_h_AfuxCXNl__IPcSRc",
    authDomain: "abms-47299.firebaseapp.com",
    projectId: "abms-47299",
    storageBucket: "abms-47299.appspot.com",
    messagingSenderId: "897112622676",
    appId: "1:897112622676:web:992c688c8066ecced78fc1",
    measurementId: "G-QXJM4W8RD4",
    // databaseURL: "https://abms-47299.firebaseio.com",
    databaseURL: "https://abms-47299-default-rtdb.asia-southeast1.firebasedatabase.app",
    };

    if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    }
    export {firebase}