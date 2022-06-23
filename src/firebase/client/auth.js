import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { au } from "../creds/client";

export const firebaseAdminLogin = async ({ uid, passkey }) => {
	const email = `${uid}@tako.asq`;
	await signInWithEmailAndPassword(au, email, passkey);
};
