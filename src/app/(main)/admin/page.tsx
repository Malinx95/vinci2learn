"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/dataTable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import useRequireAuth, { useUserSession } from "@/lib/firebase/hooks/auth";
import {
	createCourse,
	deleteCourse,
	listCoursesForUser,
} from "@/lib/prisma/courses";
import {
	addLesson,
	deleteLesson,
	listLessonsForCourse,
} from "@/lib/prisma/lessons";
import { getUser } from "@/lib/prisma/users";
import type { Course, Lesson } from "@prisma/client";
import { Pencil1Icon, PlusCircledIcon, TrashIcon } from "@radix-ui/react-icons";
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

	async function refreshCourses() {
		if (!userId) return;
		const courses = await listCoursesForUser(userId);
		setCourses(courses ?? []);
	}

	const [userId, setUserId] = useState<number | null>();
	const [courses, setCourses] = useState<Course[]>([]);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		refreshCourses();
	}, [userId]);

	return (
		<main className="p-10 flex flex-col gap-5">
			<form
				className="flex flex-row w-full items-center gap-2"
				onSubmit={async (e) => {
					e.preventDefault();
					if (!userId) {
						throw new Error("User not found");
					}
					await createCourse({ title, description, creatorId: userId });
					setTitle("");
					setDescription("");
					refreshCourses();
				}}
			>
				<Label htmlFor="title">Title</Label>
				<Input
					id="title"
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					required
				/>
				<Label htmlFor="description">Description</Label>
				<Input
					id="description"
					type="text"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					required
				/>
				<Button size="sm" className="h-7 gap-1">
					<PlusCircledIcon className="h-3.5 w-3.5" />
					<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
						Add Course
					</span>
				</Button>
			</form>
			<Card className="bg-muted">
				<CardHeader>
					<CardTitle>Courses</CardTitle>
					<CardDescription>
						Create and manage courses for your students
					</CardDescription>
				</CardHeader>
				<CardContent>
					<DataTable
						columns={[
							{ header: "Title", accessorKey: "title" },
							{ header: "Description", accessorKey: "description" },
							{
								header: "Actions",
								cell: (e) => (
									<>
										<LessonsDialog courseId={e.row.original.id} />
										<Button
											size="sm"
											variant="destructive"
											onClick={async () => {
												await deleteCourse(e.row.original.id);
												refreshCourses();
											}}
										>
											<TrashIcon />
										</Button>
									</>
								),
							},
						]}
						data={courses}
					/>
				</CardContent>
			</Card>
		</main>
	);
}

function LessonsDialog({ courseId }: { courseId: number }) {
	const [lessons, setLessons] = useState<Lesson[]>([]);

	async function refreshLessons() {
		const lessons = await listLessonsForCourse(courseId);
		setLessons(lessons ?? []);
	}

	useEffect(() => {
		refreshLessons();
	}, []);

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [exp, setExp] = useState(0);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size="sm">
					<Pencil1Icon />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Manage Lessons</DialogTitle>
					<DialogDescription>
						Manage the lessons for this course
					</DialogDescription>
				</DialogHeader>
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						await addLesson({ title, description, courseId, exp });
						setTitle("");
						setDescription("");
						setExp(0);
						refreshLessons();
					}}
				>
					<div className="grid gap-2">
						<Label htmlFor="title">Title</Label>
						<Input
							id="title"
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
						/>
						<Label htmlFor="description">Description</Label>
						<Input
							id="description"
							type="text"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							required
						/>
						<Label htmlFor="exp">Exp</Label>
						<Input
							id="exp"
							type="number"
							value={exp}
							onChange={(e) => setExp(Number(e.target.value))}
							required
						/>
						<Button size="sm" className="h-7 gap-1">
							<PlusCircledIcon className="h-3.5 w-3.5" />
							<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
								Add Lesson
							</span>
						</Button>
					</div>
				</form>
				<DataTable
					columns={[
						{ header: "Title", accessorKey: "title" },
						{ header: "Description", accessorKey: "description" },
						{ header: "Exp", accessorKey: "exp" },
						{
							header: "Actions",
							cell: (e) => (
								<>
									{/* <Button size="sm">
                    <Pencil1Icon />
                  </Button> */}
									<Button
										size="sm"
										variant="destructive"
										onClick={async () => {
											await deleteLesson(e.row.original.id);
											refreshLessons();
										}}
									>
										<TrashIcon />
									</Button>
								</>
							),
						},
					]}
					data={lessons}
				/>
			</DialogContent>
		</Dialog>
	);
}
