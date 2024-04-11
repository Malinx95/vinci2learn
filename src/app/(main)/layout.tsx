"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { signOut } from "@/lib/firebase/auth";
import useRequireAuth, { useUserSession } from "@/lib/firebase/hooks/auth";
import {
	BackpackIcon,
	HamburgerMenuIcon,
	PersonIcon,
} from "@radix-ui/react-icons";

export default function MainLayout({
	children,
}: { children: React.ReactNode }) {
	useRequireAuth();
	const user = useUserSession();
	return (
		<>
			<header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 content-between">
				<nav className="hidden w-full flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
					<Link
						href="#"
						className="flex items-center gap-2 text-lg font-semibold md:text-base"
					>
						<BackpackIcon className="h-6 w-6" />
						<span className="sr-only">Acme Inc</span>
					</Link>
					<Link
						href="/courses"
						className="text-foreground transition-colors hover:text-foreground"
					>
						Courses
					</Link>
					<Link
						href="/admin"
						className="text-foreground transition-colors hover:text-foreground"
					>
						Admin
					</Link>
					<Link
						href="/leaderboard"
						className="text-muted-foreground transition-colors hover:text-foreground"
					>
						Leaderboard
					</Link>
				</nav>
				<Sheet>
					<SheetTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							className="shrink-0 md:hidden"
						>
							<HamburgerMenuIcon className="h-5 w-5" />
							<span className="sr-only">Toggle navigation menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="left">
						<nav className="grid gap-6 text-lg font-medium">
							<Link
								href="/courses"
								className="flex items-center gap-2 text-lg font-semibold"
							>
								<BackpackIcon className="h-6 w-6" />
								<span className="sr-only">Acme Inc</span>
							</Link>
							<Link href="/courses" className="hover:text-foreground">
								Courses
							</Link>
							<Link href="/admin" className="hover:text-foreground">
								Admin
							</Link>
							<Link
								href="/leaderboard"
								className="text-muted-foreground hover:text-foreground"
							>
								Leaderboard
							</Link>
						</nav>
					</SheetContent>
				</Sheet>
				<div className="flex items-center md:ml-auto">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="secondary" size="icon" className="rounded-full">
								<PersonIcon className="h-5 w-5" />
								<span className="sr-only">Toggle user menu</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem disabled>{user?.email}</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={async () => {
									await signOut();
								}}
							>
								Logout
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</header>
			{children}
		</>
	);
}
