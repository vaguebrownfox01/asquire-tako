import { Box, TextField, Typography } from "@mui/material";
import * as React from "react";

import { Context as SubjectContext } from "../state/data/SubjectContext";

const classes = {
	textField: (t) => ({ display: "flex", margin: t.spacing(2, 4, 4, 0) }),
};

const SubjectID = React.memo(function SubjectID() {
	const { state: subjectState, subjectInfoAction } =
		React.useContext(SubjectContext);

	function handleFieldInput({ target }) {
		const { value } = target;
		subjectInfoAction({ value, field: this.field });
	}

	return (
		<Box>
			{subjectState.fields.map((f) => (
				<TextField
					key={f.id}
					sx={classes.textField}
					id={f.id}
					label={f.label}
					type={f.type}
					variant="outlined"
					value={subjectState[f.field]}
					onChange={handleFieldInput.bind({ field: f.field })}
					autoComplete="off"
				/>
			))}
			<Typography>{subjectState.subjectId}</Typography>
		</Box>
	);
});

export default SubjectID;
