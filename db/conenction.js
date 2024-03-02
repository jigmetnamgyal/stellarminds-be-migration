const { Client } = require("pg");

class DatabaseRepository {
	constructor(dbConfig) {
		this.client = new Client(dbConfig);
	}

	async connect() {
		try {
			await this.client.connect();
			console.log("Successfully connected to the database");
		} catch (error) {
			console.error("Error connecting to the database:", error.message);
		}
	}

	async disconnect() {
		try {
			await this.client.end();
			console.log("Successfully disconnected from the database");
		} catch (error) {
			console.error("Error disconnecting from the database:", error.message);
		}
	}

	pgClient() {
		return this.client;
	}
}

module.exports = DatabaseRepository;
