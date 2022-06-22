import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import { Box, Card, CardContent, IconButton } from "@mui/material";
import { Container } from "@mui/system";
import * as React from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { currentSubQuery } from "../../firebase/client/firestore";
import InfoDisplay from "../components/InfoDisplay";
import StimCard from "../components/StimCard";
import { RecordContext } from "../state/data/RecordContext";

const classes = {
	boxRoot: {
		display: "flex",
		flexDirection: "column",
	},
	cardRoot: (t) => ({
		display: "flex",
		flexDirection: "column",
		alignItems: "stretch",
		margin: t.spacing("auto", 2, 0),
	}),
	buttonRoot: (t) => ({
		display: "flex",
		justifyContent: "space-around",
		marginTop: t.spacing(2),
		transform: "scale(1.2)",
	}),
	imgRoot: (t) => ({ height: 128, width: 128, margin: t.spacing(2, "auto") }),
	playerShow: {
		width: "100%",
	},
};
const MAX_REC_DURATION = 121_000;

const Recorder = React.memo(function Recorder() {
	const [currSubState] = useDocumentData(currentSubQuery);

	const {
		state: recordState,
		recordInitAction,
		recordStartAction,
		recordStopAction,
		recordUploadAction,
	} = React.useContext(RecordContext);

	const playerRef = React.useRef();
	const vizRef = React.useRef();

	React.useEffect(() => {
		if (!currSubState) return;
		const { recordOn, recordUpload, currentStim } = currSubState;
		const {
			audioInputStream,
			recordDone,
			recodingNow,
			uploadingNow,
			uploadDone,
		} = recordState;

		if (recordOn && !recodingNow) {
			// Start recording
			recordStartAction({ audioInputStream, subjectState: currSubState });
		} else if (recodingNow) {
			// Stop recording
			recordStopAction({ stim: currentStim });
		}

		if (
			!recordOn &&
			recordDone &&
			recordUpload &&
			!uploadingNow &&
			!uploadDone
		) {
			recordUploadAction({ recordState });
		}

		// console.log({
		// 	recordOn,
		// 	recordDone,
		// 	recordUpload,
		// 	uploadingNow,
		// 	uploadDone,
		// });

		return () => {};
	}, [currSubState]);

	React.useEffect(() => {
		recordInitAction();

		return () => {};
	}, []);

	return (
		<Container maxWidth="sm">
			<Box sx={classes.boxRoot}>
				{currSubState && (
					<>
						<InfoDisplay info={currSubState} />
						<StimCard subjectInfo={currSubState} />
					</>
				)}

				<Card ref={vizRef}>
					<CardContent sx={classes.cardRoot}>
						<AudioPlayer
							{...{ playerRef, audioUrl: recordState.audioUrl }}
						/>

						{/* <>
							<Box sx={classes.buttonRoot}>
								<IconButton size="large">
									<ArrowBackIosIcon />
								</IconButton>
								<IconButton size="large" onClick={handleRecord}>
									<RadioButtonCheckedIcon color="secondary" />
								</IconButton>
								<IconButton size="large">
									<ArrowForwardIosIcon />
								</IconButton>
							</Box>
						</> */}
					</CardContent>
				</Card>
			</Box>
		</Container>
	);
});

export default Recorder;

const AudioPlayer = React.memo(function AudioPlayer({ audioUrl, playerRef }) {
	return (
		<Box>
			<audio
				ref={playerRef}
				style={classes.playerShow}
				src={audioUrl}
				controls
			/>
		</Box>
	);
});
