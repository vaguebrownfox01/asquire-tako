import { Box } from "@mui/material";
import * as React from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { currentSubQuery } from "../../firebase/client/firestore";
import InfoDisplay from "../components/InfoDisplay";
import RecordCard from "../components/RecordCard";
import StimCard from "../components/StimCard";
import { SubjectContext } from "../state/data/SubjectContext";

const subInf = {
	label: "sents",
	tag: "sent",
	imageLink: "",
	audioDescriptionLink: null,

	description:
		'Start recording and Say **"I am very excited to contribute!"**',
};

const RecordStep = React.memo(function RecordStep() {
	const [currSubState, loading, error] = useDocumentData(currentSubQuery);

	const { state: subjectState, subjectFirebaseUpdateAction } =
		React.useContext(SubjectContext);

	const handleRecordStart = () => {
		let recordState = {
			isRecording: true,
			recDone: false,
		};

		subjectFirebaseUpdateAction({
			subjectState: { ...subjectState, ...recordState },
		});
	};

	const handleRecordStop = () => {
		let recordState = {
			isRecording: false,
			recDone: true,
			audioFileName: "audio.wav",
		};

		subjectFirebaseUpdateAction({
			subjectState: { ...subjectState, ...recordState },
		});
	};

	function handleRecord() {
		let rState = {};
		switch (this.action) {
			case "start":
				rState = {
					isRecording: true,
					recDone: false,
					audioFilename: "audio.wav",
				};
				break;
			case "stop":
				rState = {
					isRecording: false,
					recDone: true,
					audioFilename: "audio.wav",
					audioUrl: "",
				};
				break;
			default:
				break;
		}

		subjectFirebaseUpdateAction({
			subjectState: { ...subjectState, ...rState },
		});
	}

	return (
		<Box>
			{currSubState ? (
				<InfoDisplay info={currSubState} />
			) : (
				<h3>Loading...</h3>
			)}
			<StimCard subjectInfo={subInf} />
			<RecordCard {...{ handleRecord }} />
		</Box>
	);
});

export default RecordStep;
