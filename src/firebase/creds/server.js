var admin = require("firebase-admin");
var config = require("./server-tako-vrx.json");

const { DATABASE_URL } = require("./setup");

admin.initializeApp({
	credential: admin.credential.cert(config),
	databaseURL: DATABASE_URL,
});
