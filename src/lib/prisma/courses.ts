"use server";
import "server-only";

import { type Course, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function listCourses(): Promise<Course[] | undefined> {
	try {
		const courses = await prisma.course.findMany();
		return courses;
	} catch (error) {
		console.error("Error listing courses", error);
	}
}

export async function listCoursesForUser(id: number) {
	try {
		const courses = await prisma.course.findMany({
			where: {
				creator: {
					id: Number(id),
				},
			},
		});
		return courses;
	} catch (error) {
		console.error("Error listing courses for user", error);
	}
}

export async function listCoursesWithLessons() {
	try {
		const courses = await prisma.course.findMany({
			include: {
				lessons: true,
			},
		});
		return courses;
	} catch (error) {
		console.error("Error listing courses with lessons", error);
	}
}

export async function listCoursesWithLessonsAndUsersProgress(id: number) {
	try {
		const courses = await prisma.course.findMany({
			include: {
				lessons: {
					include: {
						users: {
							where: {
								id: Number(id),
							},
						},
					},
				},
				users: {
					where: {
						id: Number(id),
					},
					include: {
						lessons: true,
					},
				},
			},
		});
		return courses;
	} catch (error) {
		console.error("Error listing courses with lessons", error);
	}
}

export async function getCourseWithLessons(id: number) {
	try {
		const course = await prisma.course.findUnique({
			where: {
				id: Number(id),
			},
			include: {
				lessons: true,
			},
		});
		return course;
	} catch (error) {
		console.error("Error getting course with lessons", error);
	}
}

export async function getCourse(id: number) {
	try {
		const course = await prisma.course.findUnique({
			where: {
				id: Number(id),
			},
		});
		return course;
	} catch (error) {
		console.error("Error getting course", error);
	}
}

export async function createCourse({
	description,
	title,
	creatorId,
}: Omit<Course, "id">) {
	try {
		await prisma.course.create({
			data: {
				title,
				description,
				creatorId,
			},
		});
		console.log("success");
	} catch (error) {
		console.error("Error creating course", error);
	}
}

export async function deleteCourse(id: number) {
	try {
		await prisma.course.delete({
			where: {
				id: Number(id),
			},
		});
		console.log("success");
	} catch (error) {
		console.error("Error deleting course", error);
	}
}

export async function updateCourse(
	id: number,
	data: Partial<Omit<Course, "creatorId" | "id">>,
) {
	try {
		await prisma.course.update({
			where: {
				id: Number(id),
			},
			data,
		});
		console.log("success");
	} catch (error) {
		console.error("Error updating course", error);
	}
}

export async function markCourseComplete(courseId: number, userId: number) {
	try {
		await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				courses: {
					connect: {
						id: courseId,
					},
				},
			},
		});
		console.log("success");
	} catch (error) {
		console.error("Error marking course as complete", error);
	}
}
