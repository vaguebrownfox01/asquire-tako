import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Step from "@mui/material/Step";
import StepContent from "@mui/material/StepContent";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import * as React from "react";
import InfoStep from "./InfoStep";
import QuestionStep from "./QuestionStep";
import RecordStep from "./RecordStep";

import { SubjectContext } from "../state/data/SubjectContext";
import SubjectList from "./SubjectList";

const steps = [
	{
		label: "Subject List",
		description: `list of subjects`,
		component: <SubjectList />,
	},
	{
		label: "Subject Info",
		description: `create id`,
		component: <InfoStep />,
	},
	{
		label: "Questionnaire",
		description: "meta data",
		component: <QuestionStep />,
	},
	{
		label: "Record",
		description: `audio record`,
		component: <RecordStep />,
	},
];

const step = {
	SUB_LIST: 0,
	SUB_INFO: 1,
	SUB_QUES: 2,
	SUB_RECD: 3,
};

const Steps = React.memo(function Steps({ admin }) {
	const { state: subjectState, subjectFirebaseUpdateAction } =
		React.useContext(SubjectContext);

	const [activeStep, setActiveStep] = React.useState(step.SUB_LIST);

	const [disable, setDisable] = React.useState(true);

	React.useEffect(() => {
		switch (activeStep) {
			case step.SUB_LIST:
				setDisable(false);
				break;

			case step.SUB_INFO:
				setDisable(!subjectState.infoDone);
				break;

			case step.SUB_QUES:
				setDisable(!subjectState.questionDone);
				break;

			case step.SUB_RECD:
				setDisable(true);
				break;

			default:
				setDisable(true);
				break;
		}
	}, [subjectState, activeStep]);

	const handleNext = () => {
		if (activeStep === step.SUB_LIST) {
			subjectFirebaseUpdateAction({
				subjectState: { ...subjectState, admin: admin?.email },
			});
		} else {
			subjectFirebaseUpdateAction({ subjectState, action: "update" });
		}
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleReset = () => {
		setActiveStep(step.SUB_INFO);
	};

	const classes = {
		root: ({ spacing: s }) => ({ maxWidth: s(64), margin: s(2, "auto") }),
	};

	return (
		<Box sx={classes.root}>
			<Stepper activeStep={activeStep} orientation="vertical">
				{steps.map((step, index) => (
					<Step key={step.label}>
						<StepLabel>{step.label}</StepLabel>
						<StepContent
							TransitionProps={{
								unmountOnExit: true,
							}}
						>
							<>{step.component}</>
							<StepButtons
								{...{ index, handleNext, handleBack, disable }}
							/>
						</StepContent>
					</Step>
				))}
			</Stepper>
			{activeStep === steps.length && (
				<Paper square elevation={0} sx={{ p: 3 }}>
					<Typography>
						All steps completed - you&apos;re finished
					</Typography>
					<Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
						Reset
					</Button>
				</Paper>
			)}
		</Box>
	);
});

export default Steps;

const StepButtons = ({ index, handleNext, handleBack, disable }) => {
	return (
		<Box sx={{ mb: 2, paddingTop: 2 }}>
			<div>
				<Button
					disabled={index === 0}
					onClick={handleBack}
					sx={{ mt: 1, mr: 1 }}
				>
					Back
				</Button>
				<Button
					variant="contained"
					disabled={disable}
					onClick={handleNext}
					sx={{ mt: 1, mr: 1 }}
				>
					{index === steps.length - 1 ? "Finish" : "Continue"}
				</Button>
			</div>
		</Box>
	);
};
