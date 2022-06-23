const { getFirestore } = require("firebase/firestore");
const { getStorage } = require("firebase/storage");
const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const config = require("./client-tako-vrx.json");

const app = initializeApp(config);

export const db = getFirestore(app);
export const st = getStorage(app);
export const au = getAuth(app);
