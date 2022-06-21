import {
	Box,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";
import * as React from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { currentSubQuery } from "../../firebase/client/firestore";

import { SubjectContext } from "../state/data/SubjectContext";

const classes = {
	fieldRoot: (t) => ({ paddingTop: t.spacing(2) }),
	textField: function s(t) {
		return {
			margin: t.spacing(0, 4, 4, 0),
			width: `${100 - this.i * 7}%`,
		};
	},
	selectMenu: (t) => ({ maxWidth: t.spacing(24) }),
};

const InfoStep = React.memo(function InfoStep() {
	const {
		state: subjectState,
		subjectInfoAction,
		subjectSetAllInfoAction,
	} = React.useContext(SubjectContext);

	const [currSubState] = useDocumentData(currentSubQuery);

	const [done, setDone] = React.useState(false);

	function handleFieldInput({ target }) {
		const { value } = target;
		subjectInfoAction({ value, field: this.field });
	}

	React.useEffect(() => {
		subjectSetAllInfoAction({ subjectState: currSubState });
	}, [currSubState]);

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
			{subjectState.fields.map((f, i) =>
				f.type !== "menu" ? (
					<TextField
						key={`${f.id}-${i}`}
						sx={classes.textField.bind({ i })}
						id={f.id}
						label={f.label}
						type={f.type}
						variant="outlined"
						value={subjectState[f.field]}
						onChange={handleFieldInput.bind({ field: f.field })}
						autoComplete="off"
					/>
				) : (
					<FormControl key={`${f.id}-${i}`} fullWidth>
						<InputLabel id={`${f.id}-label`}>Gender</InputLabel>
						<Select
							sx={classes.selectMenu}
							labelId={`${f.id}-label`}
							id={`${f.id}-select-helper`}
							value={subjectState[f.field]}
							label={`${f.label}`}
							onChange={handleFieldInput.bind({ field: f.field })}
						>
							{subjectState.genders.map((g, i) => (
								<MenuItem
									key={`${g.value}+${i}`}
									value={`${g.value}`}
								>{`${g.label}`}</MenuItem>
							))}
						</Select>
					</FormControl>
				)
			)}
		</Box>
	);
});

export default InfoStep;
