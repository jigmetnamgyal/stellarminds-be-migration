require("dotenv").config();

const DatabaseRepository = require("./db/conenction");
const GetUserData = require("./getUserData");
const INSERT_PROFILE_QUERY = require("./sql/createProfile");

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

			for (const usr of usersFromClerk) {
				try {
					const emailAddress =
						usr.email_addresses[0]?.email_address || "invalid@email.com";
					const userID = usr.id;
					const firstName = usr.first_name;
					const lastName = usr.last_name;

					const values = [emailAddress, userID, firstName, lastName];

					// Execute query and wait for result
					const res = await client.query(INSERT_PROFILE_QUERY, values);
					console.log(res)
				} catch (error) {
					// Handle errors that might occur during the query
					console.error("Error inserting profile:", error);
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
