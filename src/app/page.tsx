"use client";

import useRequireAuth from "@/lib/firebase/auth";
import Link from "next/link";

export default function Home() {
	useRequireAuth();

	return (
		<main>
			<h1>Home</h1>
			<Link href="/login">Login</Link>
		</main>
	);
}
