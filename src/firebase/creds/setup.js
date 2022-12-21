// Firebase
exports.PROJECT_ID = "tako-vrx";

// Version code
exports.VERSION = "02_vibe-test";
exports.USER_UUID_LEN = 8;

// Firestore
exports.DATABASE_URL =
	"https://tako-vrx-default-rtdb.asia-southeast1.firebasedatabase.app";
exports.SUBJECT_COLLECTION = `subjects-${this.VERSION}`;
exports.CONTENT_COLLECTION = "content";
exports.STIM_DOC = `/${this.CONTENT_COLLECTION}/stimulus`;
exports.SURVEY_DOC = `/${this.CONTENT_COLLECTION}/survey`;

exports.REC_STATE = "/state/record";
exports.SUB_STATE = "/state/current";
exports.HEAD_STATE = "/state/head";

// Content paths
exports.SURVEY_PATH =
	"/home/jeevan/Documents/developer/webapps/tako-asquire/src/app/appconfig/content/questions.js";
exports.STIMS_PATH =
	"/home/jeevan/Documents/developer/webapps/tako-asquire/src/app/appconfig/content/stimulus.js";

exports.SERVER_CONFIG_PATH =
	"/home/jeevan/Documents/developer/webapps/tako-asquire/src/firebase/creds/server-tako-vrx.json";

// Storage
exports.STORAGE_BUCKET = "tako-vrx.appspot.com";

//  folder path
exports.AUDIO_DATA_FOLDER = `audio_data_x${this.VERSION}`;
