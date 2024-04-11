export const revalidate = 0;
import { PrismaClient } from "@prisma/client";

export default async function Page() {
	const prisma = new PrismaClient();

	const users = await prisma.user.findMany({
		include: {
			lessons: true,
		},
	});

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

	const usersWithProgress = users.map((user) => {
		const exp = user.lessons.reduce((acc, lesson) => lesson.exp + acc, 0);
		return {
			...user,
			exp,
			...calculateLevelAndXP(exp),
		};
	});

	const sortedUsers = usersWithProgress.sort((a, b) => b.exp - a.exp);

	return (
		<main className="p-10 flex flex-col items-center">
			<h1 className="text-3xl font-bold">Leaderboard</h1>
			<ul>
				{sortedUsers.map((user, index) => (
					<li key={user.id}>
						{index} - {user.email} - level {user.level} - {user.exp} XP
					</li>
				))}
			</ul>
		</main>
	);
}
