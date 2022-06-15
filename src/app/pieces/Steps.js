import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import SubjectID from "./SubjectID";

const steps = [
	{
		label: "Subject ID",
		description: `create id`,
		component: <SubjectID />,
	},
	{
		label: "Questionnaire",
		description: "meta data",
		component: <p>{`Meta Data collection, Fill survey form`}</p>,
	},
	{
		label: "Record",
		description: `audio record`,
		component: <p>{`Record and Upload the audio`}</p>,
	},
];

const Steps = React.memo(function Steps() {
	const [activeStep, setActiveStep] = React.useState(0);

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleReset = () => {
		setActiveStep(0);
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
						<StepContent>
							<>{step.component}</>
							<StepButtons
								{...{ index, handleNext, handleBack }}
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

const StepButtons = ({ index, handleNext, handleBack }) => {
	return (
		<Box sx={{ mb: 2 }}>
			<div>
				<Button
					variant="contained"
					onClick={handleNext}
					sx={{ mt: 1, mr: 1 }}
				>
					{index === steps.length - 1 ? "Finish" : "Continue"}
				</Button>
				<Button
					disabled={index === 0}
					onClick={handleBack}
					sx={{ mt: 1, mr: 1 }}
				>
					Back
				</Button>
			</div>
		</Box>
	);
};
