"use client";

import Image from "next/image";
import Logo from "../../../public/logo.jpg";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp } from "@/lib/firebase/auth";
import { useUserSession } from "@/lib/firebase/hooks/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Form({ mode = "login" }: { mode: "login" | "signup" }) {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const user = useUserSession();
	console.log(user);
	return (
		<div className="w-screen h-screen lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
			<div className="flex items-center justify-center py-12">
				<div className="mx-auto grid w-[400px] gap-6">
					<div className="grid gap-2 text-center">
						<h1 className="text-3xl font-bold">
							{mode === "login" ? "Login" : "Sign up"}
						</h1>
						<p className="text-balance text-muted-foreground">
							{mode === "login"
								? "Enter your email below to login to your account"
								: "Enter your email below to create an account"}
						</p>
					</div>
					<div className="grid gap-4">
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div className="grid gap-2">
							<div className="flex items-center">
								<Label htmlFor="password">Password</Label>
								{/* <Link
									href="/forgot-password"
									className="ml-auto inline-block text-sm underline"
								>
									Forgot your password?
								</Link> */}
							</div>
							<Input
								id="password"
								type="password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						<Button
							type="submit"
							className="w-full"
							onClick={async () => {
								if (mode === "login") {
									await signIn(email, password);
								}
								if (mode === "signup") {
									await signUp(email, password);
								}
								router.push("/courses");
							}}
						>
							{mode === "login" ? "Login" : "Sign up"}
						</Button>
					</div>
					<div className="mt-4 text-center text-sm">
						{mode === "login"
							? "Don't have an account?"
							: "Already have an account?"}{" "}
						<Link
							href={mode === "login" ? "/signup" : "/login"}
							className="underline"
						>
							{mode === "login" ? "Sign up" : "Login"}
						</Link>
					</div>
				</div>
			</div>
			<div className="hidden bg-muted lg:block">
				<Image
					src={Logo}
					alt="Image"
					width="1920"
					height="1080"
					className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
				/>
			</div>
		</div>
	);
}
