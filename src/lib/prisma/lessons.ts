"use server";
import "server-only";

import { type Lesson, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function listLessonsForCourse(
	courseId: number,
): Promise<Lesson[] | undefined> {
	try {
		const lessons = await prisma.lesson.findMany({
			where: {
				courseId: Number(courseId),
			},
		});
		return lessons;
	} catch (error) {
		console.error("Error listing lessons", error);
	}
}

export async function addLesson({
	title,
	description,
	courseId,
	exp,
}: Omit<Lesson, "id">) {
	try {
		await prisma.lesson.create({
			data: {
				title,
				description,
				courseId,
				exp,
			},
		});
		console.log("success");
	} catch (error) {
		console.error("Error creating lesson", error);
	}
}

export async function deleteLesson(id: number) {
	try {
		await prisma.lesson.delete({
			where: {
				id: Number(id),
			},
		});
		console.log("success");
	} catch (error) {
		console.error("Error deleting lesson", error);
	}
}

export async function getLesson(id: number) {
	try {
		const lesson = await prisma.lesson.findUnique({
			where: {
				id: Number(id),
			},
		});
		return lesson;
	} catch (error) {
		console.error("Error getting lesson", error);
	}
}

export async function getLessonWithUserProgress(id: number, userId: number) {
	try {
		const lesson = await prisma.lesson.findUnique({
			where: {
				id: Number(id),
			},
			include: {
				users: {
					where: {
						id: Number(userId),
					},
				},
			},
		});
		return lesson;
	} catch (error) {
		console.error("Error getting lesson with user progress", error);
	}
}

export async function markLessonComplete(lessonId: number, userId: number) {
	try {
		await prisma.lesson.update({
			where: {
				id: Number(lessonId),
			},
			data: {
				users: {
					connect: {
						id: Number(userId),
					},
				},
			},
		});
		console.log("success");
	} catch (error) {
		console.error("Error marking lesson complete", error);
	}
}
