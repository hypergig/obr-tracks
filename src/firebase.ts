// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics"
import { initializeApp } from "firebase/app"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBFTMWd50KdTF_OHFwdLuHDma9xiyYAGgw",
  authDomain: "obr-extensions.firebaseapp.com",
  projectId: "obr-extensions",
  storageBucket: "obr-extensions.appspot.com",
  messagingSenderId: "1097208999347",
  appId: "1:1097208999347:web:f569ebe9d295da21196fc6",
  measurementId: "G-5T0NTMVF7H",
}

export const app = initializeApp(firebaseConfig)
export const analytics = getAnalytics(app)
