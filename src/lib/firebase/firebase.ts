// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyDv8F6Ofd72KSgDo9z3qmvtiwoQkZfG1U0",
	authDomain: "vinci2learn.firebaseapp.com",
	projectId: "vinci2learn",
	storageBucket: "vinci2learn.appspot.com",
	messagingSenderId: "517993744865",
	appId: "1:517993744865:web:0494cc2ea526232cafeaa0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
