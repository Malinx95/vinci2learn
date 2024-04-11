import { PrismaClient } from "@prisma/client";

export default async function Page() {
	const prisma = new PrismaClient();

	const users = await prisma.user.findMany({
		include: {
			lessons: true,
		},
	});

	const usersWithProgress = users.map((user) => {
		const exp = user.lessons.reduce((acc, lesson) => lesson.exp + acc, 0);
		return {
			...user,
			exp,
		};
	});

	const sortedUsers = usersWithProgress.sort((a, b) => b.exp - a.exp);

	return (
		<main className="p-10 flex flex-col items-center">
			<h1 className="text-3xl font-bold">Leaderboard</h1>
			<ul>
				{sortedUsers.map((user, index) => (
					<li key={user.id}>
						{index} - {user.email} - {user.exp} XP
					</li>
				))}
			</ul>
		</main>
	);
}
