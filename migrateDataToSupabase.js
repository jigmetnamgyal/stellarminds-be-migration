require("dotenv").config();

const DatabaseRepository = require("./db/conenction");
const GetUserData = require("./getUserData");

const dbConfig = {
	connectionString: process.env.DATABASE_URL,
};

const databaseRepository = new DatabaseRepository(dbConfig);

const client = databaseRepository.pgClient();

databaseRepository
	.connect()
	.then(async () => {
		try {
            const users = await GetUserData
            console.log(users)
		} catch (error) {
			console.log(error);
			process.exit(1);
		}
	})
	.catch((error) => {
		console.error("An error occurred:", error.message);
		process.exit(1);
	});
