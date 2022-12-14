import { Box, Card, CardContent } from "@mui/material";
import { Container } from "@mui/system";
import * as React from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { currentSubQuery } from "../../firebase/client/firestore";
import DeviceType from "../components/DeviceType";
import InfoDisplay from "../components/InfoDisplay";
import Wait from "../components/Progress";
import Spectrum from "../components/Spectrum";
import StimCard from "../components/StimCard";
import useContainerDimensions from "../hooks/useContainerDimensions";
import { RecordContext } from "../state/data/RecordContext";

const classes = {
	boxRoot: {
		display: "flex",
		flexDirection: "column",
		alignItems: "stretch",
	},
	cardRoot: (t) => ({
		position: "relative",
		overflow: "hidden",
		minHeight: "30vh",
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

// const MAX_REC_DURATION = 121_000;

const Recorder = React.memo(function Recorder() {
	const [currSubState] = useDocumentData(currentSubQuery);

	const {
		state: recordState,
		recordInitAction,
		recordStartAction,
		recordStopAction,
		recordUploadAction,
		recordResetAction,
	} = React.useContext(RecordContext);

	const playerRef = React.useRef();
	const vizRef = React.useRef();

	const { width, height } = useContainerDimensions(vizRef, recordState);

	const [upWait, setUpWait] = React.useState(false);

	React.useEffect(() => {
		if (!currSubState) return;
		const { recordOn, recordUpload, currentStim, firebaseId } =
			currSubState;
		const {
			audioInputStream,
			recordDone,
			recordingNow,
			uploadingNow,
			uploadDone,
		} = recordState;

		if (recordOn && !recordingNow) {
			// Start recording
			recordStartAction({ audioInputStream, subjectState: currSubState });
		} else if (recordingNow) {
			// Stop recording
			recordStopAction({ info: { ...currentStim, firebaseId } });
		}

		if (
			!recordOn &&
			recordDone &&
			recordUpload &&
			!uploadingNow &&
			!uploadDone
		) {
			recordUploadAction({ ...recordState, firebaseId });
		}

		console.log({
			recordOn,
			recordDone,
			recordUpload,
			uploadingNow,
			uploadDone,
		});
	}, [currSubState]);

	React.useEffect(() => {
		recordInitAction();
		return () => recordResetAction();
	}, []);

	React.useEffect(() => {
		const { uploadingNow } = recordState;

		let upWaitStatus = uploadingNow;
		setUpWait(upWaitStatus);
	}, [recordState]);

	return (
		<Container maxWidth="sm">
			<Box sx={classes.boxRoot}>
				{currSubState ? (
					<>
						<InfoDisplay info={currSubState} />
						<StimCard
							subjectInfo={currSubState}
							statusCode={recordState.statusCode}
							wait={upWait}
						/>
					</>
				) : (
					<Wait />
				)}

				<Card sx={{ position: "relative", marginTop: 1 }} ref={vizRef}>
					<Spectrum
						{...{
							height,
							width,
							audioAnalyserNode: recordState.audioAnalyserNode,
							recordingNow: recordState.recordingNow,
						}}
					/>
					<CardContent sx={classes.cardRoot}>
						{recordState.recordDone && (
							<AudioPlayer
								{...{
									playerRef,
									audioUrl: recordState.audioUrl,
									recordDone: recordState.recordDone,
								}}
							/>
						)}
					</CardContent>
				</Card>
				<DeviceType {...{ recordState }} />
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
