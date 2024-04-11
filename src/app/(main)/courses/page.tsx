"use client";

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import useRequireAuth, { useUserSession } from "@/lib/firebase/hooks/auth";
import { listCoursesWithLessonsAndUsersProgress } from "@/lib/prisma/courses";
import { getUser } from "@/lib/prisma/users";
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

	return (
		<main className="p-10">
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
