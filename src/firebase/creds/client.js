const { getFirestore } = require("firebase/firestore");
const { initializeApp } = require("firebase/app");
const config = require("./client-tako-vrx.json");

const app = initializeApp(config);

export const db = getFirestore(app);
