const { DATABASE_URL, SERVER_CONFIG_PATH } = require("./setup");

const {
	initializeApp,
	applicationDefault,
	cert,
} = require("firebase-admin/app");

const {
	getFirestore,
	Timestamp,
	FieldValue,
} = require("firebase-admin/firestore");

process.env["GOOGLE_APPLICATION_CREDENTIALS"] = SERVER_CONFIG_PATH;

initializeApp({
	credential: applicationDefault(),
	databaseURL: DATABASE_URL,
});

exports.server_db = getFirestore();
