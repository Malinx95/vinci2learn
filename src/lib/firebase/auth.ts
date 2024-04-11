import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { createUser } from "../prisma/users";
import { auth } from "./firebase";

export async function signIn(email: string, password: string) {
	try {
		await signInWithEmailAndPassword(auth, email, password);
		console.log("success");
	} catch (error) {
		console.error("Error signing in", error);
	}
}

export async function signUp(email: string, password: string) {
	try {
		await createUserWithEmailAndPassword(auth, email, password);
		console.log("success");
		await createUser(email);
	} catch (error) {
		console.error("Error signing up", error);
	}
}

export async function signOut() {
	try {
		await auth.signOut();
	} catch (error) {
		console.error("Error signing out", error);
	}
}
