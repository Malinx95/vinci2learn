"use server";
import "server-only";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createUser(email: string) {
	try {
		await prisma.user.create({
			data: {
				email,
			},
		});
		console.log("success");
	} catch (error) {
		console.error("Error creating user", error);
	}
}

export async function getUser(email: string) {
	try {
		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		});
		return user;
	} catch (error) {
		console.error("Error getting user", error);
	}
}

export async function getUserWithLessons(email: string) {
	try {
		const user = await prisma.user.findUnique({
			where: {
				email,
			},
			include: {
				lessons: true,
			},
		});
		return user;
	} catch (error) {
		console.error("Error getting user with lessons", error);
	}
}

export async function listUsers() {
	try {
		const users = await prisma.user.findMany();
		return users;
	} catch (error) {
		console.error("Error listing users", error);
	}
}
