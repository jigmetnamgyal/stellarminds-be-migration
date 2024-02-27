const fetch = require("node-fetch");
const dotenv = require("dotenv");
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://soavmitfelaofnfyoojq.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;

dotenv.config();

async function migrateToSupabase() {
	try {
		const result = await fetch(
			"https://stellarmindsapp-default-rtdb.asia-southeast1.firebasedatabase.app/user.json",
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		if (!result.ok) {
			throw Error(result.statusText);
		}

		const journals = await result.json();
		console.log(journals);

		const supabaseResult = await fetch(supabaseUrl, {
			method: "user",
		});

		const supabase = createClient(supabaseUrl, supabaseKey);
	} catch (error) {
		console.log(error);
	}
}

migrateToSupabase();
