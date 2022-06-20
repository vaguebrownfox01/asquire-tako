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

	const { subjectFirebaseUpdateAction } = React.useContext(SubjectContext);

	function handleRecord() {
		subjectFirebaseUpdateAction({
			subjectState: { ...currSubState },
			action: this.action,
		});
	}

	return (
		<Box>
			{currSubState ? (
				<>
					<InfoDisplay info={currSubState} />
					<StimCard subjectInfo={subInf} />
					<RecordCard {...{ handleRecord, currSubState }} />
				</>
			) : (
				<h3>Loading...</h3>
			)}
		</Box>
	);
});

export default RecordStep;
