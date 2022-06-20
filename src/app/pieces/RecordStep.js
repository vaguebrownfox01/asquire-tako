import { Box } from "@mui/material";
import * as React from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { currentSubQuery } from "../../firebase/client/firestore";
import InfoDisplay from "../components/InfoDisplay";
import RecordCard from "../components/RecordCard";
import StimCard from "../components/StimCard";
import { RecordContext } from "../state/data/RecordContext";

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

	const { state: recordState } = React.useContext(RecordContext);

	return (
		<Box>
			{currSubState ? (
				<InfoDisplay info={currSubState} />
			) : (
				<h3>Loading...</h3>
			)}
			<StimCard subjectInfo={subInf} />
			<RecordCard />
		</Box>
	);
});

export default RecordStep;
