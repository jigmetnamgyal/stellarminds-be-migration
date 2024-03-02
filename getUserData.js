const dotenv = require("dotenv");
const FirebaseClient = require("./firebase/client");

dotenv.config();

const GetUserData = async (reqBody = {}) => {
	const options = {
		method: "GET",
		path: "",
		requestBody: reqBody,
	};

	const request = new FirebaseClient().SendRequest;

	const req = await request(options);
	return req;
};

module.exports = GetUserData;
