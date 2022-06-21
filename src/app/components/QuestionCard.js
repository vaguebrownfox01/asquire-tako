import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
	Box,
	Card,
	CardContent,
	Collapse,
	FormControl,
	FormControlLabel,
	FormLabel,
	IconButton,
	Radio,
	RadioGroup,
	TextField,
	Typography,
} from "@mui/material";
import * as React from "react";

const classes = {
	cardRoot: (t) => ({ margin: t.spacing("auto", 2, 0) }),
	formRoot: (t) => ({}),
	radioGroup: (t) => ({ margin: t.spacing(0, 2) }),
	textField: (t) => ({ margin: t.spacing(2, 2) }),
	buttonRoot: (t) => ({
		display: "flex",
		justifyContent: "space-around",
		marginTop: t.spacing(2),
	}),
};

const QuestionCard = React.memo(function QuestionCard({
	question,
	handleSubmit,
	done,
}) {
	const [answer, setAnswer] = React.useState({
		question: question.question,
		answer: null,
	});

	const handleRadioButton = ({ target }) => {
		const { value } = target;
		setAnswer((p) => ({ ...p, answer: value }));
	};

	function handleNext() {
		if (!answer.answer && this.next) return;
		console.log("next", this.next);
		let ans = answer;
		setAnswer(() => ({ question: null, answer: null }));

		handleSubmit({ answer: ans, next: this.next });
	}

	return (
		<Card>
			<CardContent sx={classes.cardRoot}>
				<Collapse in={!done}>
					<FormControl sx={classes.formRoot}>
						<FormLabel id={`questionformlabel${question.qno}`}>
							<Typography
								variant="h6"
								component="div"
								gutterBottom
							>{`${question.qno}. ${question.question}`}</Typography>
						</FormLabel>
						<RadioGroup
							id={`radiooptions-${question.qno}`}
							sx={classes.radioGroup}
							value={answer.answer}
							onChange={handleRadioButton}
							name="radio-buttons-group-options"
							aria-labelledby="radio-buttons-group-label"
						>
							{question.options && (
								<>
									{question.options.map((o, i) => (
										<FormControlLabel
											id={`${o}-${question.qno}`}
											key={`${o}-${i}`}
											value={o}
											control={<Radio />}
											label={o}
										/>
									))}
								</>
							)}
							<>
								{question?.options?.length === 0 && (
									<TextField
										id={`textinput-${question.qno}`}
										sx={classes.textField}
										variant="outlined"
										type="text"
										value={answer.a}
										label="Answer"
										placeholder="Enter your answer"
										onChange={handleRadioButton}
									/>
								)}
							</>
						</RadioGroup>
					</FormControl>
				</Collapse>
				<Collapse in={done}>
					<Typography
						sx={{ textAlign: "center" }}
						color="GrayText"
						variant="h6"
						gutterBottom
					>
						Done!!!
					</Typography>
				</Collapse>
				<Box sx={classes.buttonRoot}>
					<IconButton
						disabled={question.qno === 1}
						onClick={handleNext.bind({ next: false })}
					>
						<ArrowBackIosIcon />
					</IconButton>
					<IconButton
						onSubmit={handleNext.bind({ next: true })}
						disabled={done}
						onClick={handleNext.bind({ next: true })}
					>
						<ArrowForwardIosIcon />
					</IconButton>
				</Box>
			</CardContent>
		</Card>
	);
});

export default QuestionCard;
