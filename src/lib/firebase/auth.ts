import {
	type User,
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
	} catch (error) {
		console.error("Error signing up", error);
	}
}

export async function signOut() {
	try {
		await auth.signOut();
		localStorage.removeItem("user");
	} catch (error) {
		console.error("Error signing out", error);
	}
}

export function useUserSession() {
	const defaultUser = localStorage.getItem("user");
	const [user, setUser] = useState<User | null>(
		defaultUser !== null ? JSON.parse(defaultUser) : null,
	);
	const router = useRouter();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (authUser) => {
			setUser(authUser);
			if (authUser) {
				localStorage.setItem("user", JSON.stringify(authUser));
			} else {
				localStorage.removeItem("user");
			}
		});
		return () => {
			unsubscribe();
		};
	}, []);

	useEffect(() => {
		onAuthStateChanged(auth, (authUser) => {
			if (user === undefined) return;
			if (user?.email !== authUser?.email) {
				router.refresh();
			}
		});
	}, [user, router.refresh]);

	return user;
}

export default function useRequireAuth() {
	const user = useUserSession();
	const router = useRouter();
	useEffect(() => {
		if (user === null) {
			router.push("/login");
		}
	}, [user, router.push]);
}
