import { st } from "../creds/client";
import { ref, uploadBytes } from "firebase/storage";
import { AUDIO_DATA_FOLDER } from "../creds/setup";

export const firebaseSubjectAudioUpload = async ({ fileName, wavBlob }) => {
	const storageRef = ref(st, AUDIO_DATA_FOLDER);
	const res = await uploadBytes(storageRef, wavBlob).catch((e) => {
		console.log("firebase upload wavblob failed!");
		return null;
	});

	console.log("upload result: ", res?.metadata || "error");
};
