import * as React from "react";
import { Box } from "@mui/material";
import RecordCard from "../components/RecordCard";

const RecordStep = React.memo(function RecordStep() {
	return (
		<Box>
			<RecordCard />
		</Box>
	);
});

export default RecordStep;
