require("dotenv").config();

const DatabaseRepository = require("./db/conenction");
const GetUserData = require("./getUserData");
const INSERT_JOURNALS_QUERY = require("./sql/createJournal");
const firebaseUsers = require("./firebase-users.json");

const dbConfig = {
	connectionString: process.env.DATABASE_URL,
};

const databaseRepository = new DatabaseRepository(dbConfig);

const client = databaseRepository.pgClient();

const clerkBackendApiKey = process.env.CLERK_KEY;

databaseRepository
	.connect()
	.then(async () => {
		try {
			const users = await GetUserData();
			// console.log(users['wa31qojizjhb7UcdeCrxft9sKg82'])
			const result = await fetch(
				"https://api.clerk.dev/v1/users?limit=100&offset=0",
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${clerkBackendApiKey}`,
						"Content-Type": "application/json",
					},
				}
			);

			if (!result.ok) {
				throw Error(result.statusText);
			}

			const usersFromClerk = await result.json();

			for (usr of firebaseUsers.users) {
				const localID = usr.localId;
				const emailAddress = usr.email;

				clerkUser = usersFromClerk.find(
					(usr) => usr.email_addresses?.[0].email_address == emailAddress
				);

				const userID = clerkUser.id;

				const dbJournal = await GetUserData();
				const journal = dbJournal[localID];

				if (!!journal?.journal) {
					const result = Object.keys(journal.journal).reduce(
						(res, currentVal) => {
							res.push({ key: currentVal, value: journal.journal[currentVal] });
							return res;
						},
						[]
					);

					const details = result.map((usrJournal) => {
						return {
							content: usrJournal.value.content,
							createdAt: usrJournal.value.time,
							emotionType: usrJournal.value.mood,
							title: usrJournal.value.question,
							key: usrJournal.key,
						};
					});

					for (detail of details) {
						const values = [
							userID,
							detail.title,
							detail.createdAt,
							detail.emotionType,
							detail.content,
							true,
						];

						const res = await client.query(INSERT_JOURNALS_QUERY, values);
						console.log(res);
					}
				}
			}

			process.exit(0);
		} catch (error) {
			console.log(error);
			process.exit(1);
		}
	})
	.catch((error) => {
		console.error("An error occurred:", error.message);
		process.exit(1);
	});
