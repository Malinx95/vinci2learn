import { type User, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "../firebase";

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
