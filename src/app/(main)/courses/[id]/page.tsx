"use client";

import { Button } from "@/components/ui/button";
import useRequireAuth, { useUserSession } from "@/lib/firebase/hooks/auth";
import { getCourseWithLessons, markCourseComplete } from "@/lib/prisma/courses";
import {
	getLessonWithUserProgress,
	markLessonComplete,
} from "@/lib/prisma/lessons";
import { getUser } from "@/lib/prisma/users";
import type { Course, Lesson } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({ params: { id } }: { params: { id: number } }) {
	useRequireAuth();
	const user = useUserSession();

	const router = useRouter();

	const [userId, setUserId] = useState<number | null>();

	useEffect(() => {
		if (!user?.email) return;
		getUser(user.email).then((usr) => {
			setUserId(usr?.id);
		});
	}, [user]);

	const [course, setCourse] = useState<(Course & { lessons: Lesson[] }) | null>(
		null,
	);

	const [index, setIndex] = useState(0);

	function getCourse() {
		getCourseWithLessons(id).then((course) => {
			setCourse(course ?? null);
		});
	}

	useEffect(() => {
		getCourse();
	}, []);

	async function finishLesson() {
		if (!course) return;
		if (!userId) return;
		const currentLesson = await getLessonWithUserProgress(
			course.lessons[index].id,
			userId,
		);
		if (!currentLesson) return;
		if (currentLesson.users.length === 0) {
			await markLessonComplete(course.lessons[index].id, userId);
		}
		if (index === course.lessons.length - 1) {
			await markCourseComplete(course.id, userId);
			router.push("/courses");
			return;
		}
		setIndex((prev) => prev + 1);
	}

	if (!course) {
		return <p>Loading...</p>;
	}

	return (
		<main className="p-10">
			<h1 className="text-3xl font-bold mb-2">{course.title}</h1>
			<p>{course.description}</p>
			<div
				key={course.lessons[index].id}
				className="border-b border-gray-200 py-4"
			>
				<h2 className="text-xl font-bold">{course.lessons[index].title}</h2>
				<p>{course.lessons[index].description}</p>
				<p>Exp: {course.lessons[index].exp}</p>
			</div>
			<Button
				onClick={() => setIndex((prev) => prev - 1)}
				disabled={index === 0}
			>
				Previous
			</Button>
			<Button onClick={() => finishLesson()}>
				{index === course.lessons.length - 1 ? "Finish" : "Next"}
			</Button>
		</main>
	);
}
