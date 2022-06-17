import { Box, TextField, Typography } from "@mui/material";
import * as React from "react";

import { Context as SubjectContext } from "../state/data/SubjectContext";

const classes = {
	fieldRoot: (t) => ({ paddingTop: t.spacing(2) }),
	textField: function s(t) {
		return {
			margin: t.spacing(0, 4, 4, 0),
			width: `${100 - this.i * 7}%`,
		};
	},
};

const SubjectID = React.memo(function SubjectID() {
	const { state: subjectState, subjectInfoAction } =
		React.useContext(SubjectContext);

	const [done, setDone] = React.useState(false);

	function handleFieldInput({ target }) {
		const { value } = target;
		subjectInfoAction({ value, field: this.field });
	}

	React.useEffect(() => {
		subjectInfoAction({ value: done, field: "infoDone" });
	}, [done]);

	React.useEffect(() => {
		const checkFields = () => {
			const fields = subjectState.fields;
			for (let f of fields) {
				if (subjectState[f.field] === "") return false;
			}
			return true;
		};

		setDone(() => checkFields());
	}, [subjectState]);

	return (
		<Box sx={classes.fieldRoot}>
			{subjectState.fields.map((f, i) => (
				<TextField
					key={f.id}
					sx={classes.textField.bind({ i })}
					id={f.id}
					label={f.label}
					type={f.type}
					variant="outlined"
					value={subjectState[f.field]}
					onChange={handleFieldInput.bind({ field: f.field })}
					autoComplete="off"
				/>
			))}
		</Box>
	);
});

export default SubjectID;
