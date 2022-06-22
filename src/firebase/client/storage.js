import { st } from "../creds/client";
import { ref, uploadBytes } from "firebase/storage";
import { AUDIO_DATA_FOLDER } from "../creds/setup";

export const firebaseSubjectAudioUpload = async ({ fileName, wavBlob }) => {
	const path = `${AUDIO_DATA_FOLDER}/${fileName}`;
	const storageRef = ref(st, path);
	const metadata = {
		contentType: "audio/wav",
	};
	const res = await uploadBytes(storageRef, wavBlob, metadata).catch((e) => {
		console.log("firebase upload wavblob failed!");
		return null;
	});

	console.log("upload result: ", res?.metadata || "error");
};
