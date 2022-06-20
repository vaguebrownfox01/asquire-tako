import * as React from "react";
import { Box } from "@mui/material";
import RecordCard from "../components/RecordCard";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { currentSubQuery } from "../../firebase/client/firestore";
import InfoDisplay from "../components/InfoDisplay";

const RecordStep = React.memo(function RecordStep() {
	const [currSubState, loading, error] = useDocumentData(currentSubQuery);

	return (
		<Box>
			{currSubState ? (
				<InfoDisplay info={currSubState} />
			) : (
				<h3>Loading...</h3>
			)}
			<RecordCard />
		</Box>
	);
});

export default RecordStep;
