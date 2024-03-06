import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBcKZ-rNW4E0qDU_h_AfuxCXNl__IPcSRc",
  authDomain: "abms-47299.firebaseapp.com",
  projectId: "abms-47299",
  storageBucket: "abms-47299.appspot.com",
  messagingSenderId: "897112622676",
  appId: "1:897112622676:web:992c688c8066ecced78fc1",
  measurementId: "G-QXJM4W8RD4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);