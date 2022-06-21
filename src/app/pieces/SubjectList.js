import SubjectIcon from "@mui/icons-material/AccountCircle";
import { Box, ListItemIcon } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { subjectsQuery } from "../../firebase/client/firestore";
import { SubjectContext } from "../state/data/SubjectContext";

const SubjectList = React.memo(function SubjectList() {
	const [subjectList] = useCollectionData(subjectsQuery);

	const { state: subjectState, subjectSetAllInfoAction } =
		React.useContext(SubjectContext);

	function handleSubjectSelect() {
		subjectSetAllInfoAction({
			subjectState: this.subjectState,
			action: this.action,
		});
	}
	return (
		<Box>
			{subjectList && (
				<List
					sx={{
						width: "100%",
						maxWidth: 360,
						bgcolor: "background.paper",
					}}
					aria-label="contacts"
				>
					{subjectList.map((sub, i) => (
						<ListItem key={sub.firebaseId} disablePadding>
							<ListItemButton
								selected={
									subjectState.firebaseId === sub.firebaseId
								}
								onClick={handleSubjectSelect.bind({
									subjectState: sub,
								})}
							>
								<ListItemIcon>
									<SubjectIcon />
								</ListItemIcon>
								<ListItemText
									primary={`${sub.subjectName}, ${sub.subjectAge}y`}
								/>
							</ListItemButton>
						</ListItem>
					))}
					<ListItem disablePadding>
						<ListItemButton
							selected={subjectState.subjectName === ""}
							onClick={handleSubjectSelect.bind({
								subjectState: {},
								action: "reset",
							})}
						>
							<ListItemIcon>
								<SubjectIcon />
							</ListItemIcon>
							<ListItemText secondary={"New Subject"} />
						</ListItemButton>
					</ListItem>
				</List>
			)}
		</Box>
	);
});

export default SubjectList;
