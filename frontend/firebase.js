import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: "vertexai-3fabe.firebaseapp.com",
	projectId: "vertexai-3fabe",
	storageBucket: "vertexai-3fabe.firebasestorage.app",
	messagingSenderId: "743176578374",
	appId: "1:743176578374:web:f490493b618e5c680f7147",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
