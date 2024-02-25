const fetch = require("node-fetch");
const firebaseUsers = require("./firebase-users.json");
const dotenv = require("dotenv");
dotenv.config();

async function migrateToClerk() {
	const signerKey = process.env.SIGNER_KEY;
	const saltSeparator = process.env.SALT_SEPARATOR;
	const rounds = +process.env.ROUNDS;
	const memoryCost = +process.env.MEM_COST;

	const clerkBackendApiKey = process.env.CLERK_KEY;

	for (let user of firebaseUsers.users) {
		const { email, localId, passwordHash, salt } = user;

		const body = {
			email_address: [email],
			external_id: localId,
			password_hasher: "scrypt_firebase",
			password_digest: `${passwordHash}$${salt}$${signerKey}$${saltSeparator}$${rounds}$${memoryCost}`,
			first_name: "jtn",
			last_name: "namgyal",
		};

		try {
			const result = await fetch("https://api.clerk.dev/v1/users", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${clerkBackendApiKey}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			});

			if (!result.ok) {
				throw Error(result.statusText);
			} else {
				console.log(`${email} added successfully`);
			}
		} catch (error) {
			console.error(`Error migrating ${email}: ${error}`);
		}
	}
}

migrateToClerk();
