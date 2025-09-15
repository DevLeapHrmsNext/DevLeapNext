// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBWsGAkHJPxUb8BuaXmhzF2-reWM9lrEhA",
//   authDomain: "leap-hrms2.firebaseapp.com",
//   projectId: "leap-hrms2",
//   storageBucket: "leap-hrms2.firebasestorage.app",
//   messagingSenderId: "100410730404",
//   appId: "1:100410730404:web:9b2231fa88a2e212798331",
//   measurementId: "G-5SQZQCKPBC"
// };

const firebaseConfig = {
  apiKey: "AIzaSyBBpz9a_A9PTGOFeWZyvEFdqNfpoavU5HM",
  authDomain: "aipexhrms-fb0fd.firebaseapp.com",
  databaseURL: "https://aipexhrms-fb0fd.firebaseio.com",
  projectId: "aipexhrms-fb0fd",
  storageBucket: "aipexhrms-fb0fd.appspot.com",
  messagingSenderId: "1042815356275",
  appId: "1:1042815356275:web:e220b47fa1e09262fd4906",
  measurementId: "G-82N44DLPTW"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

let messaging: ReturnType<typeof getMessaging> | null = null;
let app: ReturnType<typeof initializeApp> | null = null;
if (typeof window !== "undefined") {
  app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
}
export { messaging, getToken, onMessage };