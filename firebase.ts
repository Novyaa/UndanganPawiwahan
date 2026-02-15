import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC7VuCrIA7aLCAUmfFa5u2r7r1fjoUOPKE",
  authDomain: "undigi-invitation.firebaseapp.com",
  projectId: "undigi-invitation",
  storageBucket: "undigi-invitation.firebasestorage.app",
  messagingSenderId: "175786400912",
  appId: "1:175786400912:web:16c256e1bbe9a60f8acc15",
  measurementId: "G-J7FTVP249X"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
