import { Box } from "@mui/material";
import * as React from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import {
	currentSubQuery,
	stimulusQuery,
} from "../../firebase/client/firestore";
import InfoDisplay from "../components/InfoDisplay";
import Wait from "../components/Progress";
import RecordCard from "../components/RecordCard";
import StimCard from "../components/StimCard";
import { SubjectContext } from "../state/data/SubjectContext";

const RecordStep = React.memo(function RecordStep() {
	const [currSubState] = useDocumentData(currentSubQuery);
	const [allStims] = useDocumentData(stimulusQuery);

	const { subjectSetStimsAction, subjectFirebaseUpdateAction } =
		React.useContext(SubjectContext);

	function handleRecord() {
		subjectFirebaseUpdateAction({
			subjectState: { ...currSubState },
			action: this.action,
			payload: null,
		});
	}

	React.useEffect(() => {
		if (!allStims) return;

		subjectSetStimsAction({ allStims });
		subjectFirebaseUpdateAction({
			subjectState: { ...currSubState },
			action: "load",
			payload: {
				currentStim: allStims[0],
				stimIndex: 0,
				stimTotalCount: Object.keys(allStims).length || 1,
			},
		});
	}, [allStims]);

	function handleStimChange() {
		// actions: "next", "prev"
		const { stimIndex, stimTotalCount } = currSubState;

		let i;
		let nextStimIndex;
		let up;
		switch (this.action) {
			case "next":
				up = true;
				i = stimIndex + 1;
				nextStimIndex = i >= stimTotalCount ? stimTotalCount - 1 : i;
				break;
			case "prev":
				up = false;
				i = stimIndex - 1;
				nextStimIndex = i < 0 ? 0 : i;
				break;
			default:
				nextStimIndex = 0;
				break;
		}

		subjectFirebaseUpdateAction({
			subjectState: { ...currSubState },
			action: "load",
			payload: {
				currentStim: allStims[nextStimIndex],
				stimIndex: nextStimIndex,
				recordUpload: up,
			},
		});
	}

	return (
		<Box>
			{currSubState ? (
				<>
					<InfoDisplay info={currSubState} />
					<StimCard subjectInfo={currSubState} />
					<RecordCard
						{...{ handleRecord, currSubState, handleStimChange }}
					/>
				</>
			) : (
				<Wait />
			)}
		</Box>
	);
});

export default RecordStep;
