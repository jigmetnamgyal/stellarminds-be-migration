const https = require("https");
require("dotenv").config();

class FirebaseClient {
    SendRequest(req_options) {
		const { method, requestBody = {}, path = "" } = req_options;

		return new Promise((resolve, reject) => {
			const options = {
				rejectUnauthorized: false,
				headers: {
					"Content-Type": "application/json",
				},
				method: method,
			};

			const request = https.request(
				process.env.FIREBASE_URL,
				options,
				(res) => {
					let statusCode = res.statusCode;
					let data = "";

					res.on("data", (chunk) => {
						data += chunk;
					});

					res.on("end", () => {
						resolve({ data: data, statusCode: statusCode });
					});

					res.on("error", (error) => {
						reject(error);
					});
				}
			);


			request.write(requestBody + " \n");

			request.end();
		});
	}
}

module.exports = FirebaseClient;