"use client";

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import useRequireAuth, { useUserSession } from "@/lib/firebase/hooks/auth";
import { listCoursesWithLessonsAndUsersProgress } from "@/lib/prisma/courses";
import { getUser, getUserWithLessons } from "@/lib/prisma/users";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
	useRequireAuth();

	const user = useUserSession();

	useEffect(() => {
		if (!user?.email) return;
		getUser(user.email).then((usr) => {
			setUserId(usr?.id);
		});
	}, [user]);

	const [userId, setUserId] = useState<number | null>();

	async function refreshCourses() {
		if (!userId) return;
		const courses = await listCoursesWithLessonsAndUsersProgress(userId);
		setCourses(courses ?? []);
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		refreshCourses();
	}, [userId]);

	const [courses, setCourses] = useState<
		NonNullable<
			Awaited<ReturnType<typeof listCoursesWithLessonsAndUsersProgress>>
		>
	>([]);

	const [xp, setXp] = useState(0);

	async function getUserXp() {
		if (!user?.email) return;
		const userWithLessons = await getUserWithLessons(user?.email);
		if (!userWithLessons) return;
		const userXp = userWithLessons.lessons.reduce((acc, lesson) => {
			return acc + lesson.exp;
		}, 0);
		setXp(userXp);
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		getUserXp();
	}, [user]);

	function calculateLevelAndXP(totalXP: number): {
		level: number;
		xpForCurrentLevel: number;
		currentXP: number;
		percentageInCurrentLevel: number;
	} {
		const baseXP = 100; // XP needed for the first level
		const xpIncreaseFactor = 0.1; // 10% increase for each level

		let level = 1;
		let xpForCurrentLevel = baseXP;
		let currentXP = totalXP;

		// Find the level and remaining XP
		while (currentXP >= xpForCurrentLevel) {
			currentXP -= xpForCurrentLevel;
			xpForCurrentLevel = Math.floor(
				xpForCurrentLevel * (1 + xpIncreaseFactor),
			);
			level++;
		}

		const xpNeededForNextLevel = Math.floor(
			xpForCurrentLevel * (1 + xpIncreaseFactor),
		);
		const xpForPreviousLevels =
			(baseXP * ((1 + xpIncreaseFactor) ** (level - 2) - 1)) / xpIncreaseFactor;

		const xpForCurrentLevelLowerBound = xpForPreviousLevels + 1;
		const xpForNextLevelLowerBound = xpForPreviousLevels + xpNeededForNextLevel;

		const percentageInCurrentLevel =
			((currentXP - xpForCurrentLevelLowerBound) /
				(xpForNextLevelLowerBound - xpForCurrentLevelLowerBound)) *
			100;

		return {
			level,
			xpForCurrentLevel,
			currentXP,
			percentageInCurrentLevel,
		};
	}

	const { level, xpForCurrentLevel, currentXP, percentageInCurrentLevel } =
		calculateLevelAndXP(xp);

	return (
		<main className="p-10">
			<div className="w-full text-center bg-slate-300 rounded-lg">
				<div
					className={`w-[${percentageInCurrentLevel.toFixed(
						0,
					)}%] bg-green-500 h-full rounded-lg`}
				/>
				{currentXP.toFixed(0)} XP / {xpForCurrentLevel.toFixed(0)} XP - Level{" "}
				{level} - totalXP: {xp}
			</div>
			<h1 className="text-3xl font-bold mb-2">Courses</h1>
			{courses.length > 0 ? (
				courses.map((course) => (
					<Link href={`/courses/${course.id}`} key={course.id}>
						<Card>
							<CardHeader className="flex flex-col items-center">
								<CardTitle className="text-xl">
									{course.title} -{" "}
									{course.users.length > 0
										? "completed"
										: `${course.lessons.reduce((acc, lesson) => {
												if (lesson.users.length > 0) {
													return acc + 1;
												}
												return acc;
											}, 0)}/${course.lessons.length}lessons`}
								</CardTitle>
								<CardDescription className="text-lg">
									{course.description}
								</CardDescription>
								{course.lessons.length} lessons :{" "}
								{course.lessons.reduce((acc, lesson) => acc + lesson.exp, 0)} XP
							</CardHeader>
						</Card>
					</Link>
				))
			) : (
				<p>No courses found</p>
			)}
		</main>
	);
}
